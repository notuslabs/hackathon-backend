import { Injectable } from '@nestjs/common';
import { ERC20 } from 'src/abis/ERC20';
import { Currency } from 'src/types/currency';
import { Hexadecimal } from 'src/types/hexadecimal';
import { currencyToTokenAddress } from 'src/utils/currencyToTokenAddress';
import { PublicClient, createPublicClient, getContract, http } from 'viem';
import { polygonMumbai, polygon } from 'viem/chains';
import { BigNumber } from 'bignumber.js';

export const currencyDecimals: Record<Currency, number> = {
  [Currency.USDC]: 6,
  [Currency.BRZ]: 18,
};

export type GetBalanceInput = {
  currency: Currency;
  address: Hexadecimal;
};

@Injectable()
export class GetBalanceService {
  #client: PublicClient;

  constructor() {
    this.#client = createPublicClient({
      chain: process.env.NODE_ENV === 'production' ? polygon : polygonMumbai,
      transport: http(),
    });
  }

  async execute({ currency, address }: GetBalanceInput) {
    const tokensContract = getContract({
      abi: ERC20,
      address: currencyToTokenAddress(currency),
      publicClient: this.#client,
    });

    const balance = await tokensContract.read.balanceOf([address]);

    return {
      balance,
      formattedBalance: BigNumber(balance.toString())
        .div(10 ** currencyDecimals[currency])
        .toString(),
    };
  }
}
