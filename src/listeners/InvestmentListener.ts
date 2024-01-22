import { Injectable } from '@nestjs/common';
import { ChainlessPermissionedSwap } from 'src/abis/ChainlessPermissionedSwap';
import { CHAINLESS_PERMISSIONED_SWAP_ADDRESS } from 'src/constants';
import { SwapStableCoinsToInvestmentTokensService } from 'src/services/SwapStableCoinsToInvestmentTokensService';
import { alchemyClient } from 'src/utils/clients';
import { z } from 'zod';

const PRICE_BIB01_USD = 107_700_000n; // 1e6
const PRICE_USD_BRL = 4_900n; // 1e3
const BRZ = '0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc';
const USDT = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f';
const BIB01 = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'.toLowerCase(); // TODO: For now, Backed doesn't have the token on Polygon's mainnet. We'll use the same token address as USDT

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

const eventArgsSchema = z.object({
  tx_hash: z.literal(`0x${z.string()}`),
  tx_nonce: z.bigint(),
  receive_amount: z.bigint(),
  receive_token: z.literal(`0x${z.string()}`),
  recipient: z.literal(`0x${z.string()}`),
  payer: z.literal(`0x${z.string()}`),
  pay_with: z.literal(`0x${z.string()}`),
  pay_amount: z.bigint(),
});

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
          const eventArgsCheck = eventArgsSchema.safeParse(event.args);

          if (!eventArgsCheck.success) {
            continue;
          }

          const eventArgs = eventArgsCheck.data;

          const rates = RATES[eventArgs.pay_with][eventArgs.receive_token];
          const receiveAmount = (eventArgs.pay_amount * rates.mul) / rates.div;

          await this.swapStableCoinsToInvestmentTokensService.execute({
            receiveAmount,
            txHash: eventArgs.tx_hash,
            txNonce: eventArgs.tx_nonce,
            receiveToken: eventArgs.receive_token,
            recipient: eventArgs.recipient,
            payer: eventArgs.payer,
            payWith: eventArgs.pay_with,
            payAmount: eventArgs.pay_amount,
          });
        }
      },
      address: CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
      eventName: 'SwapRequested',
    });
  }
}
