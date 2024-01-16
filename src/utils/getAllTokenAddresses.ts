import { Currency } from 'src/types/currency';
import { currencyToTokenAddress } from './currencyToTokenAddress';

export function getAllTokenAddresses() {
  return Object.values(Currency).map((c) => currencyToTokenAddress(c));
}
