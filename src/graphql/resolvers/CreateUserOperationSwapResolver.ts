import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateUserOperationSwapService } from "src/services/CreateUserOperationSwapService";
import { Hexadecimal } from "src/types/hexadecimal";
import { chain } from "src/utils/clients";
import { HexadecimalScalar } from "../scalars/Hexadecimal";
import { CreateUserOperationOutput } from "./CreateUserOperationWithdrawInvestmentResolver";

@Resolver()
export class CreateUserOperationSwapResolver {
	constructor(
		private createUserOperationSwapService: CreateUserOperationSwapService,
	) {}

	@Mutation(() => CreateUserOperationOutput)
	async createUserOperationSwap(
		@Args("accountAbstractionAddress", { type: () => HexadecimalScalar })
		accountAbstractionAddress: Hexadecimal,
		@Args("from", { type: () => HexadecimalScalar }) from: Hexadecimal,
		@Args("swapData", { type: () => HexadecimalScalar }) swapData: Hexadecimal,
	): Promise<CreateUserOperationOutput> {
		const userOperationData = await this.createUserOperationSwapService.execute(
			{
				accountAbstractionAddress,
				swapData,
				from,
			},
		);

		return {
			...userOperationData,
			chainId: chain.id,
		};
	}
}
