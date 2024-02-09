import { Args, Field, Mutation, ObjectType, Resolver } from "@nestjs/graphql";
import { ExecuteUserOperationService } from "src/services/ExecuteUserOperationService";
import { Hexadecimal } from "src/types/hexadecimal";
import { UserOperationModel } from "../models/UserOperationModel";
import { HexadecimalScalar } from "../scalars/Hexadecimal";

@ObjectType()
export class ExecuteUserOperationOutput {
	@Field(() => [HexadecimalScalar])
	operationHashes: Hexadecimal[];
}

@Resolver()
export class ExecuteUserOperationResolver {
	constructor(
		private executeUserOperationService: ExecuteUserOperationService,
	) {}

	@Mutation(() => ExecuteUserOperationOutput)
	async userOperationExecute(
		@Args("userOperations", { type: () => [UserOperationModel] })
		userOperations: UserOperationModel[],
	): Promise<ExecuteUserOperationOutput> {
		const operationHashes = await this.executeUserOperationService.execute({
			userOperations,
		});

		return {
			operationHashes: operationHashes.map(op => op.userOpHash),
		};
	}
}
