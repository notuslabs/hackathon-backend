import { Injectable } from "@nestjs/common";
import { SWAP_PROVIDER } from "src/constants";
import { CreateGenericUserOperationService } from "src/services/CreateGenericUserOperationService";
import { AllCurrency } from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";

export type CreateUserOperationSwapInput = {
	from: Hexadecimal;
	swapData: Hexadecimal;
	accountAbstractionAddress: Hexadecimal;
	payFeesUsing?: AllCurrency;
};

@Injectable()
export class CreateUserOperationSwapService {
	constructor(
		private createGenericUserOperation: CreateGenericUserOperationService,
	) {}

	async execute({
		from,
		swapData,
		accountAbstractionAddress,
		payFeesUsing,
	}: CreateUserOperationSwapInput) {
		return this.createGenericUserOperation.execute({
			from,
			accountAbstractionAddress,
			contractAddress: SWAP_PROVIDER,
			encodedFunctionCall: swapData,
			payFeesUsing,
		});
	}
}
