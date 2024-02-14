import { Injectable } from "@nestjs/common";
import { ERC20 } from "src/abis/ERC20";
import { CreateGenericUserOperationService } from "src/services/CreateGenericUserOperationService";
import { AllCurrency } from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";
import { alchemyClient } from "src/utils/clients";
import { currencyToTokenAddress } from "src/utils/currencyToTokenAddress";
import { encodeFunctionData, getContract } from "viem";

export type CreateUserOperationERC20ApproveInput = {
	from: Hexadecimal;
	currency: AllCurrency;
	accountAbstractionAddress: Hexadecimal;
	spender: Hexadecimal;
};

@Injectable()
export class CreateUserOperationERC20ApproveService {
	constructor(
		private createGenericUserOperation: CreateGenericUserOperationService,
	) {}

	async execute({
		from,
		currency,
		accountAbstractionAddress,
		spender,
	}: CreateUserOperationERC20ApproveInput) {
		const currencyContract = getContract({
			abi: ERC20,
			address: currencyToTokenAddress(currency),
			publicClient: alchemyClient,
		});

		const max_uint256 = 2n ** 256n - 1n;
		const allowance = await currencyContract.read.allowance([
			accountAbstractionAddress,
			spender,
		]);

		if (allowance > 2n ** 128n - 1n) {
			return;
		}

		const approveData = encodeFunctionData({
			abi: ERC20,
			functionName: "approve",
			args: [spender, max_uint256],
		});

		return this.createGenericUserOperation.execute({
			from,
			accountAbstractionAddress,
			contractAddress: currencyToTokenAddress(currency),
			encodedFunctionCall: approveData,
		});
	}
}
