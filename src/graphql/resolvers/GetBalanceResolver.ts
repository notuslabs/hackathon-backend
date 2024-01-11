import { Args, Query, Resolver, registerEnumType } from '@nestjs/graphql';
import { GetBalanceService } from 'src/services/GetBalanceService';
import { Currency } from 'src/types/currency';
import { BigIntScalar } from '../scalars/BigInt';

@Resolver()
export class GetBalanceResolver {
  constructor(private getBalanceService: GetBalanceService) {}

  @Query(() => BigIntScalar)
  async balanceByCurrency(
    @Args('address') address: `0x${string}`,
    @Args('currency', { type: () => Currency }) currency: Currency,
  ) {
    return await this.getBalanceService.execute({
      address,
      currency,
    });
  }
}
