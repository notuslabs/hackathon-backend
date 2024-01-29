import { Injectable, Logger } from '@nestjs/common';
import { ChainlessPermissionedSwap } from 'src/abis/ChainlessPermissionedSwap';
import { CHAINLESS_PERMISSIONED_SWAP_ADDRESS } from 'src/constants';
import { SwapStableCoinsToInvestmentTokensService } from 'src/services/SwapStableCoinsToInvestmentTokensService';
import { InvestCurrency, StableCurrency } from 'src/types/currency';
import {
  Hexadecimal,
  zEthereumAddress,
  zKeccak256Hash,
} from 'src/types/hexadecimal';
import { alchemyClient } from 'src/utils/clients';
import { currencyToTokenAddress } from 'src/utils/currencyToTokenAddress';
import { z } from 'zod';

const PRICE_BIB01_USD = 107_700_000n; // 1e6
const PRICE_USD_BRL = 4_900n; // 1e3
const BRZ = currencyToTokenAddress(StableCurrency.BRZ);
const USDC = currencyToTokenAddress(StableCurrency.USDC);
const BIB01 = currencyToTokenAddress(InvestCurrency.BIB01);

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
  tx_hash: zKeccak256Hash,
  tx_nonce: z.bigint(),
  receive_token: zEthereumAddress,
  recipient: zEthereumAddress,
  payer: zEthereumAddress,
  pay_with: zEthereumAddress,
  pay_amount: z.bigint(),
});

@Injectable()
export class InvestmentListener {
  private readonly logger = new Logger(InvestmentListener.name);

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
            this.logger.error('Event with bad data', eventArgsCheck.error);
            continue;
          }

          const eventArgs = eventArgsCheck.data;

          const rates = RATES[eventArgs.pay_with][eventArgs.receive_token];
          const receiveAmount = (eventArgs.pay_amount * rates.mul) / rates.div;

          await this.swapStableCoinsToInvestmentTokensService.execute({
            receiveAmount,
            txHash: eventArgs.tx_hash as Hexadecimal,
            txNonce: eventArgs.tx_nonce,
            receiveToken: eventArgs.receive_token as Hexadecimal,
            recipient: eventArgs.recipient as Hexadecimal,
            payer: eventArgs.payer as Hexadecimal,
            payWith: eventArgs.pay_with as Hexadecimal,
            payAmount: eventArgs.pay_amount,
          });
        }
      },
      address: CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
      eventName: 'SwapRequested',
    });
  }
}
