import { Resolver, Query, Args } from '@nestjs/graphql';
import { GetAccountAbstractionAddressByOwnerService } from 'src/services/GetAccountAbstractionAddressByOwnerService';
import { Hexadecimal } from 'src/types/hexadecimal';

@Resolver()
export class GetAccountAbstractionAddressByOwnerResolver {
  constructor(
    private getAccountAbstractionAddressByOwnerService: GetAccountAbstractionAddressByOwnerService,
  ) {}

  @Query(() => String)
  async accountAbstractionAddressByOwner(
    @Args('owner') owner: Hexadecimal,
  ): Promise<string> {
    const accountAbstractionAddress =
      await this.getAccountAbstractionAddressByOwnerService.execute({
        owner,
      });

    return accountAbstractionAddress;
  }
}
