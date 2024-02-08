import {
	Args,
	Field,
	Int,
	Mutation,
	ObjectType,
	Resolver,
} from "@nestjs/graphql";
import { CreateUserOperationSwapService } from "src/services/CreateUserOperationSwapService";
import { Hexadecimal } from "src/types/hexadecimal";
import { chain } from "src/utils/clients";
import { UserOperationModel } from "../models/UserOperationModel";
import { HexadecimalScalar } from "../scalars/Hexadecimal";

@ObjectType()
export class CreateUserOperationSwapOutput {
	@Field(() => UserOperationModel)
	userOperation: UserOperationModel;
	@Field(() => Int)
	chainId: number;
}

@Resolver()
export class CreateUserOperationSwapResolver {
	constructor(
		private createUserOperationSwapService: CreateUserOperationSwapService,
	) {}

	@Mutation(() => CreateUserOperationSwapOutput)
	async createUserOperationSwap(
		@Args("accountAbstractionAddress", { type: () => HexadecimalScalar })
		accountAbstractionAddress: Hexadecimal,
		@Args("from", { type: () => HexadecimalScalar }) from: Hexadecimal,
		@Args("swapData", { type: () => HexadecimalScalar }) swapData: Hexadecimal,
	): Promise<CreateUserOperationSwapOutput> {
		const userOperation = await this.createUserOperationSwapService.execute({
			accountAbstractionAddress,
			swapData,
			from,
		});

		return {
			userOperation,
			chainId: chain.id,
		};
	}
}
