import { Injectable } from '@nestjs/common';
import { ERC20 } from 'src/abis/ERC20';
import { Currency } from 'src/types/currency';
import { Hexadecimal } from 'src/types/hexadecimal';
import { alchemyClient } from 'src/utils/clients';
import { currencyToTokenAddress } from 'src/utils/currencyToTokenAddress';
import { formatUnits, getContract } from 'viem';

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
  async execute({ currency, address }: GetBalanceInput) {
    const tokensContract = getContract({
      abi: ERC20,
      address: currencyToTokenAddress(currency),
      publicClient: alchemyClient,
    });

    const balance = await tokensContract.read.balanceOf([address]);

    return {
      balance,
      formattedBalance: formatUnits(balance, currencyDecimals[currency]),
    };
  }
}
