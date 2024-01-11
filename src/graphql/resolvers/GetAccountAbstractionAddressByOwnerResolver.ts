import { Resolver, Query, Args, ObjectType, Field } from '@nestjs/graphql';
import { GetAccountAbstractionAddressByOwnerService } from 'src/services/GetAccountAbstractionAddressByOwnerService';
import { Hexadecimal } from 'src/types/hexadecimal';

@ObjectType()
export class GetAccountAbstractionAddressByOwnerOutput {
  @Field(() => String)
  accountAbstractionAddress: string;
}

@Resolver()
export class GetAccountAbstractionAddressByOwnerResolver {
  constructor(
    private getAccountAbstractionAddressByOwnerService: GetAccountAbstractionAddressByOwnerService,
  ) {}

  @Query(() => GetAccountAbstractionAddressByOwnerOutput)
  async accountAbstractionAddressByOwner(
    @Args('owner') owner: Hexadecimal,
  ): Promise<GetAccountAbstractionAddressByOwnerOutput> {
    const accountAbstractionAddress =
      await this.getAccountAbstractionAddressByOwnerService.execute({
        owner,
      });

    return {
      accountAbstractionAddress,
    };
  }
}
