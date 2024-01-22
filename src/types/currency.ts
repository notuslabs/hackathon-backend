export enum Currency {
  USDC = 'USDC',
  BRZ = 'BRZ',
  BIB01 = 'BIB01',
}

export const currencyDecimals: Record<Currency, number> = {
  [Currency.USDC]: 6,
  [Currency.BRZ]: 18,
  [Currency.BIB01]: 18,
};
