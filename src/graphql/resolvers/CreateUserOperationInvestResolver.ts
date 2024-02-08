import {
	Args,
	Field,
	Int,
	Mutation,
	ObjectType,
	Resolver,
} from "@nestjs/graphql";
import { CreateUserOperationInvestService } from "src/services/CreateUserOperationInvestService";
import { InvestCurrency, StableCurrency } from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";
import { chain } from "src/utils/clients";
import { UserOperationModel } from "../models/UserOperationModel";
import { HexadecimalScalar } from "../scalars/Hexadecimal";

@ObjectType()
export class CreateUserOperationInvestOutput {
	@Field(() => UserOperationModel)
	userOperation: UserOperationModel;
	@Field(() => Int)
	chainId: number;
}

@Resolver()
export class CreateUserOperationInvestResolver {
	constructor(
		private createUserOperationInvestService: CreateUserOperationInvestService,
	) {}

	@Mutation(() => CreateUserOperationInvestOutput)
	async createUserOperationInvest(
		@Args("accountAbstractionAddress", { type: () => HexadecimalScalar })
		accountAbstractionAddress: Hexadecimal,
		@Args("amount") amount: string,
		@Args("currency", { type: () => StableCurrency }) currency: StableCurrency,
		@Args("from", { type: () => HexadecimalScalar }) from: Hexadecimal,
		@Args("asset", { type: () => InvestCurrency })
		asset: InvestCurrency,
	): Promise<CreateUserOperationInvestOutput> {
		const userOperation = await this.createUserOperationInvestService.execute({
			accountAbstractionAddress,
			amount,
			currency,
			from,
			asset,
		});

		return {
			userOperation,
			chainId: chain.id,
		};
	}
}
