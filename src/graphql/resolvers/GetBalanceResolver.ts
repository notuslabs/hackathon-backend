import { Args, Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { GetBalanceService } from 'src/services/GetBalanceService';
import { AllCurrency } from 'src/types/currency';
import { BigIntScalar } from '../scalars/BigInt';
import { HexadecimalScalar } from '../scalars/Hexadecimal';
import { Hexadecimal } from 'src/types/hexadecimal';

@ObjectType()
export class GetBalanceOutput {
  @Field(() => BigIntScalar)
  balance: bigint;
  @Field(() => String)
  formattedBalance: string;
}

@Resolver()
export class GetBalanceResolver {
  constructor(private getBalanceService: GetBalanceService) {}

  @Query(() => GetBalanceOutput)
  async balanceByCurrency(
    @Args('address', { type: () => HexadecimalScalar }) address: Hexadecimal,
    @Args('currency', { type: () => AllCurrency }) currency: AllCurrency,
  ) {
    return await this.getBalanceService.execute({
      address,
      currency,
    });
  }
}
