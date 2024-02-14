import { Injectable } from "@nestjs/common";
import { ChainlessPermissionedSwap } from "src/abis/ChainlessPermissionedSwap";
import { CHAINLESS_PERMISSIONED_SWAP_ADDRESS } from "src/constants";
import { CreateGenericUserOperationService } from "src/services/CreateGenericUserOperationService";
import {
	AllCurrency,
	InvestCurrency,
	StableCurrency,
	currencyDecimals,
} from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";
import { currencyToTokenAddress } from "src/utils/currencyToTokenAddress";
import { encodeFunctionData, parseUnits } from "viem";

export type CreateUserOperationWithdrawInvestmentInput = {
	from: Hexadecimal;
	accountAbstractionAddress: Hexadecimal;
	amount: string;
	currency: StableCurrency;
	asset: InvestCurrency;
	payFeesUsing?: AllCurrency;
};

@Injectable()
export class CreateUserOperationWithdrawInvestmentService {
	constructor(
		private createGenericUserOperation: CreateGenericUserOperationService,
	) {}

	async execute({
		from,
		amount,
		currency,
		asset,
		accountAbstractionAddress,
		payFeesUsing,
	}: CreateUserOperationWithdrawInvestmentInput) {
		const withdrawData = encodeFunctionData({
			abi: ChainlessPermissionedSwap,
			functionName: "withdraw",
			args: [
				currencyToTokenAddress(currency),
				accountAbstractionAddress,
				currencyToTokenAddress(asset),
				parseUnits(amount, currencyDecimals[asset]),
			],
		});

		return this.createGenericUserOperation.execute({
			from,
			accountAbstractionAddress,
			contractAddress: CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
			encodedFunctionCall: withdrawData,
			payFeesUsing,
		});
	}
}
