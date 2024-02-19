import {
	AllCurrency,
	InvestCurrency,
	StableCurrency,
} from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";

type Currency = InvestCurrency | StableCurrency | AllCurrency;

export const tokenToSymbolList: Record<Currency, Hexadecimal> = {
	USDC: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
	BRZ: "0x491a4eb4f1fc3bff8e1d2fc856a6a46663ad556f",
	// TODO: For now, Backed doesn't have the token on Polygon's mainnet. We'll use the same token address as DAI
	BIB01: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
	AAVE: "0x63a72806098bd3d9520cc43356dd78afe5d386d9",
	BAL: "0xe15bcb9e0ea69e6ab9fa080c4c4a5632896298c3",
	LINK: "0x5947bb275c521040051d82396192181b413227a3",
	COMP: "0xc3048e19e76cb9a3aa9d77d8c03c29fc906e2437",
	DAI: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
	FRAX: "0xd24c2ad096400b6fbcd2ad8b24e7acbc21a1da64",
	MIMATIC: "0x3b55e45fd6bd7d4724f5c47e0d1bcaedd059263e",
	MKR: "0x88128fd4b259552a9a1d457f435a6527aab72d42",
	SUSHI: "0x37b608519f91f70f2eeb0e5ed9af4061722e4f76",
	SNX: "0xbec243c995409e6520d7c41e404da5deba4b209b",
	USDT: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
	GRT: "0x8a0cac13c7da965a312f08ea4229c37869e85cb9",
	UNI: "0x8ebaf22b6f053dffeaf46f4dd9efa95d89ba8580",
	WBTC: "0x50b7545627a5162f82a992c33b87adc75187b218",
	WETH: "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
	WAVAX: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
	YFI: "0x9eaac1b23d935365bd7b542fe22ceee2922f52dc",
	STG: "0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590",
	WOO: "0xabc9547b534519ff73921b1fba6e672b5f58d083",
	FXS: "0x214db107654ff987ad859f34125307783fc8e387",
} as const;

export function currencyToTokenAddress(currency: Currency): Hexadecimal {
	return tokenToSymbolList[currency];
}
