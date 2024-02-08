import {
	Args,
	Field,
	Int,
	Mutation,
	ObjectType,
	Resolver,
} from "@nestjs/graphql";
import { CreateUserOperationWithdrawInvestmentService } from "src/services/CreateUserOperationWithdrawInvestmentService";
import { InvestCurrency, StableCurrency } from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";
import { chain } from "src/utils/clients";
import { UserOperationModel } from "../models/UserOperationModel";
import { HexadecimalScalar } from "../scalars/Hexadecimal";

@ObjectType()
export class CreateUserOperationWithdrawInvestmentOutput {
	@Field(() => UserOperationModel)
	userOperation: UserOperationModel;
	@Field(() => Int)
	chainId: number;
}

@Resolver()
export class CreateUserOperationWithdrawInvestmentResolver {
	constructor(
		private createUserOperationWithdrawInvestmentService: CreateUserOperationWithdrawInvestmentService,
	) {}

	@Mutation(() => CreateUserOperationWithdrawInvestmentOutput)
	async createUserOperationWithdrawInvestment(
		@Args("accountAbstractionAddress", { type: () => HexadecimalScalar })
		accountAbstractionAddress: Hexadecimal,
		@Args("amount") amount: string,
		@Args("currency", { type: () => StableCurrency }) currency: StableCurrency,
		@Args("from", { type: () => HexadecimalScalar }) from: Hexadecimal,
		@Args("asset", { type: () => InvestCurrency })
		asset: InvestCurrency,
	): Promise<CreateUserOperationWithdrawInvestmentOutput> {
		const userOperation =
			await this.createUserOperationWithdrawInvestmentService.execute({
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
