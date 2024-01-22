import 'dotenv/config';
import {
  Currency,
  StableCurrency,
  InvestCurrency,
} from 'src/types/currency';

export function currencyToTokenAddress(currency: Currency): `0x${string}` {
  switch (currency) {
    case StableCurrency.USDC:
      return process.env.NODE_ENV === 'production'
        ? '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
        : '0xCb283a7521626eB30504357949f40E4F1e67cc38';
    case StableCurrency.BRZ:
      return process.env.NODE_ENV === 'production'
        ? '0x4eD141110F6EeeAbA9A1df36d8c26f684d2475Dc'
        : '0x35928a20EfA22EA35dCde06Ac201440aAd2fEC05';
    case InvestCurrency.BIB01:
      return '0xA5c445c85089FF8AbF5C960842a4cF23669AE6D4';
  }
}
