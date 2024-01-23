import { Injectable } from '@nestjs/common';
import { ChainlessPermissionedSwap } from 'src/abis/ChainlessPermissionedSwap';
import { CHAINLESS_PERMISSIONED_SWAP_ADDRESS } from 'src/constants';
import { SwapStableCoinsToInvestmentTokensService } from 'src/services/SwapStableCoinsToInvestmentTokensService';
import { InvestCurrency, StableCurrency } from 'src/types/currency';
import { alchemyClient } from 'src/utils/clients';
import { currencyToTokenAddress } from 'src/utils/currencyToTokenAddress';
import { z } from 'zod';

const PRICE_BIB01_USD = 107_700_000n; // 1e6
const PRICE_USD_BRL = 4_900n; // 1e3
const BRZ = currencyToTokenAddress[StableCurrency.BRZ];
const USDC = currencyToTokenAddress[StableCurrency.USDC];
const BIB01 = currencyToTokenAddress[InvestCurrency.BIB01];

const RATES = {
  [BRZ]: {
    [BIB01]: {
      mul: 10n ** 9n,
      div: PRICE_BIB01_USD * PRICE_USD_BRL,
    },
  },
  [USDC]: {
    [BIB01]: {
      mul: 10n ** 18n,
      div: PRICE_BIB01_USD,
    },
  },
  [BIB01]: {
    [USDC]: {
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
