import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Hexadecimal } from 'src/types/hexadecimal';
import { BigIntScalar } from '../scalars/BigInt';

@InputType('UserOperationInput')
@ObjectType()
export class UserOperationModel {
  @Field(() => String)
  callData: Hexadecimal;
  @Field(() => String)
  sender: Hexadecimal;
  @Field(() => String)
  signature: Hexadecimal;
  @Field(() => String)
  initCode: Hexadecimal;
  @Field(() => String)
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
