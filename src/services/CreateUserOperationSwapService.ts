import { Hexadecimal } from "src/types/hexadecimal";
import { Injectable } from "@nestjs/common";
import { CreateGenericUserOperationService } from "src/services/CreateGenericUserOperationService";
import { SWAP_PROVIDER } from "src/constants";

export type CreateUserOperationSwapInput = {
	from: Hexadecimal;
	swapData: Hexadecimal;
	accountAbstractionAddress: Hexadecimal;
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
	}: CreateUserOperationSwapInput) {
		return this.createGenericUserOperation.execute({
			from,
			accountAbstractionAddress,
			contractAddress: SWAP_PROVIDER,
			encodedFunctionCall: swapData,
		});
	}
}
