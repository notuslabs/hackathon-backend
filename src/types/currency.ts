export enum AllCurrency {
  USDC = 'USDC',
  BRZ = 'BRZ',
  BIB01 = 'BIB01',
}

export enum FiatCurrency {
  BRZ = AllCurrency.BRZ,
  USDC = AllCurrency.USDC,
}

export enum FixedIncomeCurrency {
  BIB01 = AllCurrency.BIB01,
}

export type Currency = FiatCurrency | FixedIncomeCurrency;

export const currencyDecimals: Record<Currency, number> = {
  [FiatCurrency.USDC]: 6,
  [FiatCurrency.BRZ]: 18,
  [FixedIncomeCurrency.BIB01]: 18,
};
