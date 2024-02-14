import {
	Args,
	Field,
	Int,
	Mutation,
	ObjectType,
	Resolver,
} from "@nestjs/graphql";
import { CreateUserOperationWithdrawInvestmentService } from "src/services/CreateUserOperationWithdrawInvestmentService";
import {
	AllCurrency,
	InvestCurrency,
	StableCurrency,
} from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";
import { chain } from "src/utils/clients";
import { UserOperationModel } from "../models/UserOperationModel";
import { HexadecimalScalar } from "../scalars/Hexadecimal";

@ObjectType()
export class CreateUserOperationOutput {
	@Field(() => UserOperationModel)
	userOperation: UserOperationModel;
	@Field(() => String)
	maxGasFeeNative: string;
	@Field(() => String)
	maxGasFeeToken: string;
	@Field(() => AllCurrency)
	payingToken: AllCurrency;
	@Field(() => Int)
	chainId: number;
}

@Resolver()
export class CreateUserOperationWithdrawInvestmentResolver {
	constructor(
		private createUserOperationWithdrawInvestmentService: CreateUserOperationWithdrawInvestmentService,
	) {}

	@Mutation(() => CreateUserOperationOutput)
	async createUserOperationWithdrawInvestment(
		@Args("accountAbstractionAddress", { type: () => HexadecimalScalar })
		accountAbstractionAddress: Hexadecimal,
		@Args("amount") amount: string,
		@Args("currency", { type: () => StableCurrency }) currency: StableCurrency,
		@Args("from", { type: () => HexadecimalScalar }) from: Hexadecimal,
		@Args("asset", { type: () => InvestCurrency })
		asset: InvestCurrency,
		@Args("payFeesUsing", { type: () => StableCurrency, nullable: true })
		payFeesUsing?: StableCurrency,
	): Promise<CreateUserOperationOutput> {
		const userOperationData =
			await this.createUserOperationWithdrawInvestmentService.execute({
				accountAbstractionAddress,
				amount,
				currency,
				from,
				asset,
				payFeesUsing: payFeesUsing ? AllCurrency[payFeesUsing] : undefined,
			});

		return {
			...userOperationData,
			chainId: chain.id,
		};
	}
}
