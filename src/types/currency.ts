export enum Currency {
  USDC = 'USDC',
  BRZ = 'BRZ',
  JOJO = 'JOJO',
}

export const currencyDecimals: Record<Currency, number> = {
  [Currency.USDC]: 6,
  [Currency.BRZ]: 18,
  [Currency.JOJO]: 18,
};
