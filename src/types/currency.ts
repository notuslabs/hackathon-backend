export enum Currency {
  USDC = 'USDC',
  BRZ = 'BRZ',
  JOJO = 'JOJO',
  BCSPX = 'BCSPX',
}

export const currencyDecimals: Record<Currency, number> = {
  [Currency.USDC]: 6,
  [Currency.BRZ]: 18,
  [Currency.JOJO]: 18,
  [Currency.BCSPX]: 18,
};
