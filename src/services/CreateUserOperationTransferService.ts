import { Injectable } from "@nestjs/common";
import { ERC20 } from "src/abis/ERC20";
import { CreateGenericUserOperationService } from "src/services/CreateGenericUserOperationService";
import { StableCurrency, currencyDecimals } from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";
import { currencyToTokenAddress } from "src/utils/currencyToTokenAddress";
import { encodeFunctionData, parseUnits } from "viem";

export type CreateUserOperationTransferInput = {
	to: Hexadecimal;
	from: Hexadecimal;
	currency: StableCurrency;
	accountAbstractionAddress: Hexadecimal;
	amount: string;
};

@Injectable()
export class CreateUserOperationTransferService {
	constructor(
		private createGenericUserOperation: CreateGenericUserOperationService,
	) {}

	async execute({
		to,
		amount,
		from,
		currency,
		accountAbstractionAddress,
	}: CreateUserOperationTransferInput) {
		const transferData = encodeFunctionData({
			abi: ERC20,
			functionName: "transfer",
			args: [to, parseUnits(amount, currencyDecimals[currency])],
		});

		return this.createGenericUserOperation.execute({
			from,
			accountAbstractionAddress,
			contractAddress: currencyToTokenAddress(currency),
			encodedFunctionCall: transferData,
		});
	}
}
