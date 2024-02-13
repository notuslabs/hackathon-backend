import { Args, Field, Mutation, ObjectType, Resolver } from "@nestjs/graphql";
import { ExecuteUserOperationService } from "src/services/ExecuteUserOperationService";
import { Hexadecimal } from "src/types/hexadecimal";
import { UserOperationModel } from "../models/UserOperationModel";
import { HexadecimalScalar } from "../scalars/Hexadecimal";
import { formatUnits } from "viem";

@ObjectType()
export class UserOperationReceipt {
	@Field(() => Boolean)
	success: boolean;
	@Field(() => HexadecimalScalar)
	userOpHash: Hexadecimal;
	@Field(() => HexadecimalScalar)
	transactionHash: Hexadecimal;
	@Field(() => String)
	gasUsedNative: string;
}

@ObjectType()
export class ExecuteUserOperationOutput {
	@Field(() => [HexadecimalScalar], {
		deprecationReason:
			"Same information is now available in *userOpReceipts[].userOpHash*",
	})
	operationHashes: Hexadecimal[];
	@Field(() => [UserOperationReceipt])
	userOpReceipts: UserOperationReceipt[];
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
		const userOperationsReceipts =
			await this.executeUserOperationService.execute({
				userOperations,
			});

		const receipts = userOperationsReceipts.map((userOp) => ({
			success: userOp.success,
			userOpHash: userOp.userOpHash,
			transactionHash: userOp.receipt.transactionHash,
			gasUsedNative: formatUnits(userOp.actualGasCost, 18),
		}));

		return {
			operationHashes: receipts.map((op) => op.userOpHash),
			userOpReceipts: receipts,
		};
	}
}
