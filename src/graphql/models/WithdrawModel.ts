import { Field, ObjectType } from '@nestjs/graphql';
import { HexadecimalScalar } from '../scalars/Hexadecimal';
import { StableCurrency } from 'src/types/currency';
import { Hexadecimal } from 'src/types/hexadecimal';

@ObjectType()
export class WithdrawModel {
  @Field(() => HexadecimalScalar)
  blockchainDepositAddress: Hexadecimal;
  @Field(() => String)
  expiresAt: string;
  @Field(() => String)
  qrCode: string;
  @Field(() => StableCurrency)
  depositCurrency: StableCurrency;
  @Field(() => Number)
  depositAmount: number;
}
