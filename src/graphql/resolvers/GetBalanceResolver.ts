import { Args, Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { GetBalanceService } from 'src/services/GetBalanceService';
import { Currency } from 'src/types/currency';
import { BigIntScalar } from '../scalars/BigInt';
import { HexadecimalScalar } from '../scalars/Hexadecimal';

@ObjectType()
export class GetBalanceOutput {
  @Field(() => BigIntScalar)
  balance: BigInt;
  @Field(() => String)
  formattedBalance: string;
}

@Resolver()
export class GetBalanceResolver {
  constructor(private getBalanceService: GetBalanceService) {}

  @Query(() => GetBalanceOutput)
  async balanceByCurrency(
    @Args('address', { type: () => HexadecimalScalar }) address: `0x${string}`,
    @Args('currency', { type: () => Currency }) currency: Currency,
  ) {
    return await this.getBalanceService.execute({
      address,
      currency,
    });
  }
}
