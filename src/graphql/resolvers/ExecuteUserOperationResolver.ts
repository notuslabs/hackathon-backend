import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExecuteUserOperationService } from 'src/services/ExecuteUserOperationService';
import { UserOperationModel } from '../models/UserOperationModel';

@Resolver()
export class ExecuteUserOperationResolver {
  constructor(
    private executeUserOperationService: ExecuteUserOperationService,
  ) {}

  @Mutation(() => String)
  async userOperationExecute(
    @Args('userOperation') userOperation: UserOperationModel,
  ): Promise<string> {
    const opHash = await this.executeUserOperationService.execute({
      userOperation,
    });

    return opHash;
  }
}
