import { Args, Field, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { TransactionModel } from "../models/TransactionModel";
import { GetTransactionHistoryService } from "src/services/GetTransactionHistoryService";
import { HexadecimalScalar } from "../scalars/Hexadecimal";
import { Hexadecimal } from "src/types/hexadecimal";

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
		const transactions = await this.getTransactionHistoryService.execute({
			address,
		});

		return { transactions };
	}
}
