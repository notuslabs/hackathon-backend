import {
  Args,
  Field,
  Int,
  Mutation,
  ObjectType,
  Resolver,
} from '@nestjs/graphql';
import { UserOperationModel } from '../models/UserOperationModel';
import { CreateUserOperationInvestService } from 'src/services/CreateUserOperationInvestService';
import { Hexadecimal } from 'src/types/hexadecimal';
import { FiatCurrency, FixedIncomeCurrency } from 'src/types/currency';
import { chain } from 'src/utils/clients';
import { HexadecimalScalar } from '../scalars/Hexadecimal';

@ObjectType()
export class CreateUserOperationInvestOutput {
  @Field(() => UserOperationModel)
  userOperation: UserOperationModel;
  @Field(() => Int)
  chainId: number;
}

@Resolver()
export class CreateUserOperationInvestResolver {
  constructor(
    private createUserOperationInvestService: CreateUserOperationInvestService,
  ) {}

  @Mutation(() => CreateUserOperationInvestOutput)
  async createUserOperationInvest(
    @Args('accountAbstractionAddress', { type: () => HexadecimalScalar })
    accountAbstractionAddress: Hexadecimal,
    @Args('amount') amount: string,
    @Args('currency', { type: () => FiatCurrency }) currency: FiatCurrency,
    @Args('from', { type: () => HexadecimalScalar }) from: Hexadecimal,
    @Args('asset', { type: () => FixedIncomeCurrency })
    asset: FixedIncomeCurrency,
  ): Promise<CreateUserOperationInvestOutput> {
    const { userOperation } =
      await this.createUserOperationInvestService.execute({
        accountAbstractionAddress,
        amount,
        currency,
        from,
        asset,
      });

    return {
      userOperation,
      chainId: chain.id,
    };
  }
}
