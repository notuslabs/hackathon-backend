import { Injectable } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { WithdrawModel } from '../models/WithdrawModel';
import { WithdrawFiatService } from 'src/services/WithdrawFiatService';

@Injectable()
export class WithdrawFiatResolver {
  constructor(private withdrawFiatService: WithdrawFiatService) {}

  @Mutation(() => WithdrawModel)
  async withdrawFiat(
    @Args('quoteId') quoteId: string,
    @Args('recipientPixAddress') recipientPixAddress: string,
    @Args('taxId') taxId: string,
  ): Promise<WithdrawModel> {
    const {
      blockchainDepositAddress,
      expiresAt,
      qrCode,
      depositCurrency,
      depositAmount,
    } = await this.withdrawFiatService.execute({
      quoteId,
      recipientPixAddress,
      taxId,
    });

    return {
      depositAmount,
      blockchainDepositAddress,
      expiresAt,
      depositCurrency,
      qrCode,
    };
  }
}
