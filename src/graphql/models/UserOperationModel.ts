import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Hexadecimal } from "src/types/hexadecimal";
import { BigIntScalar } from "../scalars/BigInt";
import { HexadecimalScalar } from "../scalars/Hexadecimal";

@InputType("UserOperationInput")
@ObjectType()
export class UserOperationModel {
	@Field(() => HexadecimalScalar)
	callData: Hexadecimal;
	@Field(() => HexadecimalScalar)
	sender: Hexadecimal;
	@Field(() => HexadecimalScalar)
	signature: Hexadecimal;
	@Field(() => HexadecimalScalar)
	initCode: Hexadecimal;
	@Field(() => HexadecimalScalar)
	paymasterAndData: Hexadecimal;
	@Field(() => BigIntScalar)
	maxFeePerGas: bigint;
	@Field(() => BigIntScalar)
	maxPriorityFeePerGas: bigint;
	@Field(() => BigIntScalar)
	nonce: bigint;
	@Field(() => BigIntScalar)
	callGasLimit: bigint;
	@Field(() => BigIntScalar)
	preVerificationGas: bigint;
	@Field(() => BigIntScalar)
	verificationGasLimit: bigint;
}
