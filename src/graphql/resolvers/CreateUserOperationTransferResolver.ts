import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserOperationModel } from '../models/UserOperationModel';
import { CreateUserOperationTransferService } from 'src/services/CreateUserOperationTransferService';
import { Hexadecimal } from 'src/types/hexadecimal';
import { Currency } from 'src/types/currency';
import { chain } from 'src/utils/clients';

export class CreateUserOperationTransferOutput {
  userOperation: UserOperationModel;
  chainId: number;
}

@Resolver()
export class CreateUserOperationTransferResolver {
  constructor(
    private createUserOperationTransferService: CreateUserOperationTransferService,
  ) {}

  @Mutation(() => CreateUserOperationTransferOutput)
  async createUserOperationTransfer(
    @Args('accountAbstractionAddress') accountAbstractionAddress: Hexadecimal,
    @Args('amount') amount: string,
    @Args('currency', { type: () => Currency }) currency: Currency,
    @Args('from') from: Hexadecimal,
    @Args('to') to: Hexadecimal,
  ): Promise<CreateUserOperationTransferOutput> {
    const { userOperation } =
      await this.createUserOperationTransferService.execute({
        accountAbstractionAddress,
        amount,
        currency,
        from,
        to,
      });

    return {
      userOperation,
      chainId: chain.id,
    };
  }
}
