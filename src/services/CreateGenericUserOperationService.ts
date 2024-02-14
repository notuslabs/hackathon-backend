import { Injectable } from "@nestjs/common";
import { AlchemyLightAccountABI } from "src/abis/AlchemyLightAccount";
import { ERC4337 } from "src/abis/ERC4337";
import { SimpleAccountFactoryAbi } from "src/abis/SimpleAccountFactory";
import {
	CHAINLESS_PAYMASTER_ADDRESS,
	ENTRY_POINT_ADDRESS,
	FACTORY_ADDRESS,
} from "src/constants";
import { UnexpectedException } from "src/shared/UnexpectedException";
import { AllCurrency, currencyDecimals } from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";
import { UserOperation } from "src/types/useroperation";
import { alchemyClient, investmentWalletClient } from "src/utils/clients";
import { currencyToTokenAddress } from "src/utils/currencyToTokenAddress";
import {
	concatHex,
	encodeAbiParameters,
	encodeFunctionData,
	formatUnits,
	getContract,
	keccak256,
	parseUnits,
} from "viem";

export type CreateGenericUserOperationInput = {
	from: Hexadecimal;
	accountAbstractionAddress: Hexadecimal;
	contractAddress: Hexadecimal;
	encodedFunctionCall: Hexadecimal;
	payFeesUsing?: AllCurrency;
	customNonce?: bigint;
};

const CurrencyToCoingeckoSymbol = {
	[AllCurrency.USDC]: "usd",
	[AllCurrency.BRZ]: "brl",
};

const DUMMY_PAYMASTER_AND_DATA =
	"0x0B1d11e34e3e8A6e3958B7657fC335F9505a64A40000000000000000000000004ed141110f6eeeaba9a1df36d8c26f684d2475dc00000000000000000000000000000000ffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000ffffffffffff0000000000000000000000000000000000000000000000000000fffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
const DUMMY_SIGNATURE =
	"0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";

@Injectable()
export class CreateGenericUserOperationService {
	async execute({
		from,
		accountAbstractionAddress,
		contractAddress,
		encodedFunctionCall,
		payFeesUsing,
		customNonce,
	}: CreateGenericUserOperationInput) {
		const callData = encodeFunctionData({
			abi: AlchemyLightAccountABI,
			functionName: "execute",
			args: [contractAddress, 0n, encodedFunctionCall],
		});

		const contract = getContract({
			abi: ERC4337,
			address: ENTRY_POINT_ADDRESS,
			publicClient: alchemyClient,
		});

		const [
			{ baseFeePerGas },
			priorityFeePerGas,
			isAccountAbstractionDeployed,
			nonce,
		] = await Promise.all([
			alchemyClient.getBlock({
				blockTag: "latest",
			}),
			alchemyClient.request<{
				Method: "rundler_maxPriorityFeePerGas";
				Parameters?: undefined;
				ReturnType: string;
			}>({
				method: "rundler_maxPriorityFeePerGas",
			}),
			alchemyClient.getBytecode({
				address: accountAbstractionAddress,
			}),
			contract.read.getNonce([
				accountAbstractionAddress,
				customNonce ?? BigInt(Date.now()) << 64n,
			]),
		]);

		if (!baseFeePerGas) {
			throw new UnexpectedException(
				"Could not estimate fees. Received null.",
				"base_fee_null",
			);
		}

		const baseFeePlusFiftyPercent = (baseFeePerGas * (100n + 50n)) / 100n;

		const prioFeePlusFivePercent =
			(BigInt(priorityFeePerGas) * (100n + 5n)) / 100n;

		let initCode: `0x${string}` = "0x";
		if (!isAccountAbstractionDeployed) {
			initCode = concatHex([
				FACTORY_ADDRESS,
				encodeFunctionData({
					abi: SimpleAccountFactoryAbi,
					functionName: "createAccount",
					args: [from, 0n],
				}),
			]);
		}

		const payingToken = payFeesUsing ?? AllCurrency.BRZ;
		const { priceToken, paymasterAndData } =
			await this.getPaymasterAndData(payingToken);

		const userOperation: UserOperation = {
			callData: callData,
			sender: accountAbstractionAddress,
			signature: "0x" as Hexadecimal,
			initCode,
			paymasterAndData: payFeesUsing ? paymasterAndData : "0x",
			maxFeePerGas: baseFeePlusFiftyPercent + prioFeePlusFivePercent,
			maxPriorityFeePerGas: prioFeePlusFivePercent,
			nonce,
			callGasLimit: 0n,
			preVerificationGas: 0n,
			verificationGasLimit: 0n,
		};
		const { callGasLimit, preVerificationGas, verificationGasLimit } =
			await alchemyClient.estimateUserOperationGas({
				entryPoint: ENTRY_POINT_ADDRESS,
				userOperation: {
					...userOperation,
					signature: DUMMY_SIGNATURE,
					paymasterAndData: payFeesUsing ? DUMMY_PAYMASTER_AND_DATA : "0x",
				},
			});

		userOperation.callGasLimit = callGasLimit;
		userOperation.preVerificationGas = preVerificationGas;
		userOperation.verificationGasLimit = verificationGasLimit;

		const maxGasFeeNative =
			userOperation.maxFeePerGas *
			(callGasLimit + preVerificationGas + verificationGasLimit);
		const maxGasFeeToken =
			(maxGasFeeNative * priceToken) /
			10n ** BigInt(currencyDecimals[payingToken]);

		return {
			userOperation,
			maxGasFeeNative: formatUnits(maxGasFeeNative, 18),
			maxGasFeeToken: formatUnits(
				maxGasFeeToken,
				currencyDecimals[payingToken],
			),
			payingToken,
		};
	}

	async getPaymasterAndData(stableCurrency: AllCurrency) {
		const currency = CurrencyToCoingeckoSymbol[stableCurrency];
		const priceRequest = await fetch(
			`https://${
				process.env.COINGECKO_API_KEY ? "pro-" : ""
			}api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=${currency}&precision=18`,
			process.env.COINGECKO_API_KEY
				? {
						headers: {
							"x-cg-pro-api-key": process.env.COINGECKO_API_KEY,
						},
				  }
				: {},
		);
		const priceJSON = await priceRequest.json();
		const priceUint256 = parseUnits(
			priceJSON["matic-network"][currency].toString(),
			currencyDecimals[stableCurrency],
		);
		const payingToken = currencyToTokenAddress(stableCurrency);
		const validAfter = Math.floor(Date.now() / 1000) - 5;
		const validUntil = validAfter + 5 * 60;
		const paymasterData = encodeAbiParameters(
			[
				{ name: "payingToken", type: "address" },
				{ name: "exchangeRate", type: "uint256" },
				{ name: "validAfter", type: "uint48" },
				{ name: "validUntil", type: "uint48" },
			],
			[payingToken, priceUint256, validAfter, validUntil],
		);
		const signature = await investmentWalletClient.signMessage({
			message: { raw: keccak256(paymasterData) },
		});

		const paymasterAndData = concatHex([
			CHAINLESS_PAYMASTER_ADDRESS,
			paymasterData,
			signature,
		]);

		return { priceToken: priceUint256, paymasterAndData };
	}
}
