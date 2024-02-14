import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateUserOperationSwapService } from "src/services/CreateUserOperationSwapService";
import { AllCurrency, StableCurrency } from "src/types/currency";
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
		@Args("payFeesUsing", { type: () => StableCurrency, nullable: true })
		payFeesUsing?: StableCurrency,
	): Promise<CreateUserOperationOutput> {
		const userOperationData = await this.createUserOperationSwapService.execute(
			{
				accountAbstractionAddress,
				swapData,
				from,
				payFeesUsing: payFeesUsing ? AllCurrency[payFeesUsing] : undefined,
			},
		);

		return {
			...userOperationData,
			chainId: chain.id,
		};
	}
}
