import { Injectable } from '@nestjs/common';
import { ERC20 } from 'src/abis/ERC20';
import { SwapStableCoinsToInvestmentTokensService } from 'src/services/SwapStableCoinsToInvestmentTokensService';
import { alchemyClient } from 'src/utils/clients';
import { getAllTokenAddresses } from 'src/utils/getAllTokenAddresses';

@Injectable()
export class TransferListener {
  constructor(
    private readonly swapStableCoinsToInvestmentTokensService: SwapStableCoinsToInvestmentTokensService,
  ) {
    this.start();
  }

  async start() {
    alchemyClient.watchContractEvent({
      abi: ERC20,
      onLogs: async (events) => {
        for (const event of events) {
          if (!event.args.from || !event.args.value) {
            continue;
          }

          await this.swapStableCoinsToInvestmentTokensService.execute({
            amount: event.args.value,
            sendTo: event.args.from,
          });
        }
      },
      address: getAllTokenAddresses(),
      eventName: 'Transfer',
      args: {
        to: '0xcDB6d29a5f2f8d56aF07588f5BEa0E500b72548a',
      },
    });
  }
}
