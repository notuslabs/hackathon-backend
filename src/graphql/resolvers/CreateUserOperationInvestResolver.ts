import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateUserOperationInvestService } from "src/services/CreateUserOperationInvestService";
import { InvestCurrency, StableCurrency } from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";
import { chain } from "src/utils/clients";
import { HexadecimalScalar } from "../scalars/Hexadecimal";
import { CreateUserOperationOutput } from "./CreateUserOperationWithdrawInvestmentResolver";

@Resolver()
export class CreateUserOperationInvestResolver {
	constructor(
		private createUserOperationInvestService: CreateUserOperationInvestService,
	) {}

	@Mutation(() => CreateUserOperationOutput)
	async createUserOperationInvest(
		@Args("accountAbstractionAddress", { type: () => HexadecimalScalar })
		accountAbstractionAddress: Hexadecimal,
		@Args("amount") amount: string,
		@Args("currency", { type: () => StableCurrency }) currency: StableCurrency,
		@Args("from", { type: () => HexadecimalScalar }) from: Hexadecimal,
		@Args("asset", { type: () => InvestCurrency })
		asset: InvestCurrency,
	): Promise<CreateUserOperationOutput> {
		const userOperationData =
			await this.createUserOperationInvestService.execute({
				accountAbstractionAddress,
				amount,
				currency,
				from,
				asset,
			});

		return {
			...userOperationData,
			chainId: chain.id,
		};
	}
}
