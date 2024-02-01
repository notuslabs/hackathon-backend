import { Resolver, Query } from "@nestjs/graphql";
import { TransactionModel } from "../models/TransactionModel";

@Resolver()
export class DummyTransactionResolver {
	@Query(() => [TransactionModel], {
		description:
			'Just a dummy resolver to include the "TransactionModel" type in the schema',
		deprecationReason: "This is a dummy resolver, it doesn't work",
	})
	async dummyTransaction() {
		return [];
	}
}
