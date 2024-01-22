import {
  Args,
  Field,
  Int,
  Mutation,
  ObjectType,
  Resolver,
} from '@nestjs/graphql';
import { UserOperationModel } from '../models/UserOperationModel';
import { CreateUserOperationWithdrawService } from 'src/services/CreateUserOperationWithdrawService';
import { Hexadecimal } from 'src/types/hexadecimal';
import { StableCurrency, InvestCurrency } from 'src/types/currency';
import { chain } from 'src/utils/clients';
import { HexadecimalScalar } from '../scalars/Hexadecimal';

@ObjectType()
export class CreateUserOperationWithdrawOutput {
  @Field(() => UserOperationModel)
  userOperation: UserOperationModel;
  @Field(() => Int)
  chainId: number;
}

@Resolver()
export class CreateUserOperationWithdrawResolver {
  constructor(
    private createUserOperationWithdrawService: CreateUserOperationWithdrawService,
  ) {}

  @Mutation(() => CreateUserOperationWithdrawOutput)
  async createUserOperationWithdraw(
    @Args('accountAbstractionAddress', { type: () => HexadecimalScalar })
    accountAbstractionAddress: Hexadecimal,
    @Args('amount') amount: string,
    @Args('currency', { type: () => StableCurrency }) currency: StableCurrency,
    @Args('from', { type: () => HexadecimalScalar }) from: Hexadecimal,
    @Args('asset', { type: () => InvestCurrency })
    asset: InvestCurrency,
  ): Promise<CreateUserOperationWithdrawOutput> {
    const { userOperation } =
      await this.createUserOperationWithdrawService.execute({
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
