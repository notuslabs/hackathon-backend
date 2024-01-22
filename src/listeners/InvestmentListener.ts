import { Injectable } from '@nestjs/common';
import { ChainlessPermissionedSwap } from 'src/abis/ChainlessPermissionedSwap';
import { CHAINLESS_PERMISSIONED_SWAP_ADDRESS } from 'src/constants';
import {
  SwapStableCoinsToInvestmentTokensService,
} from 'src/services/SwapStableCoinsToInvestmentTokensService';
import { alchemyClient } from 'src/utils/clients';

const PRICE_BIB01_USD = 107_700_000n; // 1e6
const PRICE_USD_BRL = 4_900n; // 1e3
const BRZ = '0x35928a20EfA22EA35dCde06Ac201440aAd2fEC05'.toLocaleLowerCase();
const USDT = '0x35928a20EfA22EA35dCde06Ac201440aAd2fEC05'.toLocaleLowerCase();
const BIB01 = '0x35928a20EfA22EA35dCde06Ac201440aAd2fEC05'.toLocaleLowerCase();

const RATES = {
  [BRZ]: {
    [BIB01]: {
      mul: 10n ** 9n,
      div: PRICE_BIB01_USD * PRICE_USD_BRL,
    },
  },
  [USDT]: {
    [BIB01]: {
      mul: 10n ** 18n,
      div: PRICE_BIB01_USD,
    },
  },
  [BIB01]: {
    [USDT]: {
      mul: PRICE_BIB01_USD,
      div: 10n ** 6n,
    },
    [BRZ]: {
      mul: PRICE_BIB01_USD * PRICE_USD_BRL,
      div: 10n ** 9n,
    },
  },
};

@Injectable()
export class InvestmentListener {
  constructor(
    private readonly swapStableCoinsToInvestmentTokensService: SwapStableCoinsToInvestmentTokensService,
  ) {
    this.start();
  }

  async start() {
    alchemyClient.watchContractEvent({
      abi: ChainlessPermissionedSwap,
      onLogs: async (events) => {
        for (const event of events) {
          if (
            !event.args.tx_hash ||
            !event.args.tx_nonce ||
            !event.args.receive_token ||
            !event.args.recipient ||
            !event.args.payer ||
            !event.args.pay_with ||
            !event.args.pay_amount
          ) {
            continue;
          }

          const rates = RATES[event.args.pay_with][event.args.receive_token];
          const receive_amount =
            (event.args.pay_amount * rates.mul) / rates.div;

          await this.swapStableCoinsToInvestmentTokensService.execute({
            receive_amount,
            tx_hash: event.args.tx_hash,
            tx_nonce: event.args.tx_nonce,
            receive_token: event.args.receive_token,
            recipient: event.args.recipient,
            payer: event.args.payer,
            pay_with: event.args.pay_with,
            pay_amount: event.args.pay_amount,
          });
        }
      },
      address: CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
      eventName: 'SwapRequested',
    });
  }
}
