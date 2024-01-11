import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserOperationModel } from '../models/UserOperationModel';
import { CreateUserOperationTransferService } from 'src/services/CreateUserOperationTransferService';
import { Hexadecimal } from 'src/types/hexadecimal';
import { Currency } from 'src/types/currency';

@Resolver()
export class CreateUserOperationTransferResolver {
  constructor(
    private createUserOperationTransferService: CreateUserOperationTransferService,
  ) {}

  @Mutation(() => UserOperationModel)
  async createUserOperationTransfer(
    @Args('accountAbstractionAddress') accountAbstractionAddress: Hexadecimal,
    @Args('amount') amount: string,
    @Args('currency', { type: () => Currency }) currency: Currency,
    @Args('from') from: Hexadecimal,
    @Args('to') to: Hexadecimal,
  ): Promise<UserOperationModel> {
    const { userOperation } =
      await this.createUserOperationTransferService.execute({
        accountAbstractionAddress,
        amount,
        currency,
        from,
        to,
      });

    return userOperation;
  }
}
