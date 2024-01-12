import {
  Args,
  Field,
  Int,
  Mutation,
  ObjectType,
  Resolver,
} from '@nestjs/graphql';
import { UserOperationModel } from '../models/UserOperationModel';
import { CreateUserOperationTransferService } from 'src/services/CreateUserOperationTransferService';
import { Hexadecimal } from 'src/types/hexadecimal';
import { Currency } from 'src/types/currency';
import { chain } from 'src/utils/clients';
import { HexadecimalScalar } from '../scalars/Hexadecimal';

@ObjectType()
export class CreateUserOperationTransferOutput {
  @Field(() => UserOperationModel)
  userOperation: UserOperationModel;
  @Field(() => Int)
  chainId: number;
}

@Resolver()
export class CreateUserOperationTransferResolver {
  constructor(
    private createUserOperationTransferService: CreateUserOperationTransferService,
  ) {}

  @Mutation(() => CreateUserOperationTransferOutput)
  async createUserOperationTransfer(
    @Args('accountAbstractionAddress', { type: () => HexadecimalScalar })
    accountAbstractionAddress: Hexadecimal,
    @Args('amount') amount: string,
    @Args('currency', { type: () => Currency }) currency: Currency,
    @Args('from', { type: () => HexadecimalScalar }) from: Hexadecimal,
    @Args('to', { type: () => HexadecimalScalar }) to: Hexadecimal,
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
