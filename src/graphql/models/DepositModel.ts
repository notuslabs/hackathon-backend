import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DepositModel {
  @Field(() => String)
  pixAddress: string;
  @Field(() => String)
  qrCode: string;
  @Field(() => String)
  expiresAt: string;
}
