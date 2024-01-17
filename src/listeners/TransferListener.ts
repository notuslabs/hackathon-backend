import { Injectable } from '@nestjs/common';
import { ERC20 } from 'src/abis/ERC20';
import { SwapStableCoinsToInvestmentTokensService } from 'src/services/SwapStableCoinsToInvestmentTokensService';
import { alchemyClient } from 'src/utils/clients';
import { getAllTokenAddresses } from 'src/utils/getAllTokenAddresses';

const PRICE_BCSPX = 475070000n;
const PRICE_USD_BRL = 49000000n;
const BRZ = '0x35928a20EfA22EA35dCde06Ac201440aAd2fEC05'.toLocaleLowerCase();

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

          const BCSPX =
            event.address === BRZ
              ? event.args.value / PRICE_USD_BRL / PRICE_BCSPX
              : (event.args.value * 1000000n) / PRICE_BCSPX;

          await this.swapStableCoinsToInvestmentTokensService.execute({
            amount: BCSPX,
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
