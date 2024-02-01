export enum AllCurrency {
	USDC = "USDC",
	BRZ = "BRZ",
	BIB01 = "BIB01",
}

export enum FiatCurrency {
	BRL = "BRL",
}

export enum StableCurrency {
	BRZ = AllCurrency.BRZ,
	USDC = AllCurrency.USDC,
}

export enum InvestCurrency {
	BIB01 = AllCurrency.BIB01,
}

export type Currency = StableCurrency | InvestCurrency;

export const currencyDecimals: Record<Currency, number> = {
	[StableCurrency.USDC]: 6,
	[StableCurrency.BRZ]: 18,
	[InvestCurrency.BIB01]: 18,
};
