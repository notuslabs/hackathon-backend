import {
	Args,
	Field,
	Int,
	Mutation,
	ObjectType,
	Resolver,
} from "@nestjs/graphql";
import { CreateUserOperationERC20ApproveService } from "src/services/CreateUserOperationERC20ApproveService";
import { AllCurrency } from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";
import { chain } from "src/utils/clients";
import { UserOperationModel } from "../models/UserOperationModel";
import { HexadecimalScalar } from "../scalars/Hexadecimal";

@ObjectType()
export class CreateUserOperationERC20ApproveOutput {
	@Field(() => UserOperationModel, { nullable: true })
	userOperation?: UserOperationModel;
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
export class CreateUserOperationERC20ApproveResolver {
	constructor(
		private createUserOperationERC20ApproveService: CreateUserOperationERC20ApproveService,
	) {}

	@Mutation(() => CreateUserOperationERC20ApproveOutput)
	async createUserOperationERC20Approve(
		@Args("accountAbstractionAddress", { type: () => HexadecimalScalar })
		accountAbstractionAddress: Hexadecimal,
		@Args("from", { type: () => HexadecimalScalar }) from: Hexadecimal,
		@Args("asset", { type: () => AllCurrency }) currency: AllCurrency,
		@Args("spender", { type: () => HexadecimalScalar }) spender: Hexadecimal,
	): Promise<CreateUserOperationERC20ApproveOutput> {
		const userOperationData =
			await this.createUserOperationERC20ApproveService.execute({
				accountAbstractionAddress,
				currency,
				from,
				spender,
			});

		return {
			userOperation: userOperationData?.userOperation,
			maxGasFeeNative: "0",
			maxGasFeeToken: "0",
			payingToken: AllCurrency.BRZ,
			chainId: chain.id,
		};
	}
}
