import { Field, ObjectType } from "@nestjs/graphql";
import { DateScalar } from "../scalars/Date";

@ObjectType()
export class TransactionModel {
	@Field(() => DateScalar, { nullable: true })
	timestamp: Date | null;
	@Field(() => String)
	type: "withdraw" | "deposit" | "invest";
	@Field(() => String)
	amount: string;
	@Field(() => String)
	asset: string;
	@Field(() => String, { nullable: true })
	transactionId: string;
}
