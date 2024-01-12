import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { ExecuteUserOperationService } from 'src/services/ExecuteUserOperationService';
import { UserOperationModel } from '../models/UserOperationModel';
import { HexadecimalScalar } from '../scalars/Hexadecimal';

@ObjectType()
export class ExecuteUserOperationOutput {
  @Field(() => HexadecimalScalar)
  operationHash: string;
}

@Resolver()
export class ExecuteUserOperationResolver {
  constructor(
    private executeUserOperationService: ExecuteUserOperationService,
  ) {}

  @Mutation(() => ExecuteUserOperationOutput)
  async userOperationExecute(
    @Args('userOperation') userOperation: UserOperationModel,
  ): Promise<ExecuteUserOperationOutput> {
    const operationHash = await this.executeUserOperationService.execute({
      userOperation,
    });

    return {
      operationHash,
    };
  }
}
