import { Field, ObjectType } from "@nestjs/graphql";
import { AllCurrency } from "src/types/currency";
import { BigIntScalar } from "../scalars/BigInt";
import { DateScalar } from "../scalars/Date";

@ObjectType()
export class TransactionModel {
	@Field(() => DateScalar, { nullable: true })
	timestamp: Date | null;
	@Field(() => String)
	type: "withdraw" | "deposit";
	@Field(() => BigIntScalar)
	amount: bigint;
	@Field(() => String)
	asset: string;
	@Field(() => String, { nullable: true })
	transactionId: string;
	@Field(() => String)
	status: "pending" | "completed";
}
