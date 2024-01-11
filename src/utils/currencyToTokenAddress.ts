import { Currency } from 'src/types/currency';

export function currencyToTokenAddress(currency: Currency): `0x${string}` {
  switch (currency) {
    case Currency.USDC:
      return '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
    case Currency.BRZ:
      return '0x4eD141110F6EeeAbA9A1df36d8c26f684d2475Dc';
  }
}
