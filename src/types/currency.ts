export enum AllCurrency {
	USDC = "USDC",
	BRZ = "BRZ",
	BIB01 = "BIB01",
	AAVE = "AAVE",
	BAL = "BAL",
	LINK = "LINK",
	COMP = "COMP",
	DAI = "DAI",
	FRAX = "FRAX",
	MIMATIC = "MIMATIC",
	MKR = "MKR",
	SUSHI = "SUSHI",
	SNX = "SNX",
	USDT = "USDT",
	GRT = "GRT",
	UNI = "UNI",
	WBTC = "WBTC",
	WETH = "WETH",
	WAVAX = "WAVAX",
	YFI = "YFI",
	STG = "STG",
	WOO = "WOO",
	FXS = "FXS",
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

export const currencyDecimals: Record<AllCurrency, number> = {
	[StableCurrency.USDC]: 6,
	[StableCurrency.BRZ]: 18,
	[InvestCurrency.BIB01]: 18,
	AAVE: 18,
	BAL: 18,
	LINK: 18,
	COMP: 18,
	DAI: 18,
	FRAX: 18,
	MIMATIC: 18,
	MKR: 18,
	SUSHI: 18,
	SNX: 18,
	USDT: 6,
	GRT: 18,
	UNI: 18,
	WBTC: 8,
	WETH: 18,
	WAVAX: 18,
	YFI: 18,
	STG: 18,
	WOO: 18,
	FXS: 18,
};
