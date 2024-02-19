import { Args, Field, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { GetTransactionHistoryService } from "src/services/GetTransactionHistoryService";
import { Hexadecimal } from "src/types/hexadecimal";
import { TransactionModel } from "../models/TransactionModel";
import { HexadecimalScalar } from "../scalars/Hexadecimal";

@ObjectType()
class GetTransactionHistoryOutput {
	@Field(() => [TransactionModel])
	transactions: TransactionModel[];
}

@Resolver()
export class GetTransactionHistoryResolver {
	constructor(
		private getTransactionHistoryService: GetTransactionHistoryService,
	) {}

	@Query(() => GetTransactionHistoryOutput)
	async transactions(
		@Args("address", { type: () => HexadecimalScalar })
		address: Hexadecimal,
	): Promise<GetTransactionHistoryOutput> {
		// const transactions = await this.getTransactionHistoryService.execute({
		// 	address,
		// });

		return { transactions: [] };
	}
}
