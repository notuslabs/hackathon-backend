import {
  AllCurrency,
  InvestCurrency,
  StableCurrency,
} from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";

type Currency = InvestCurrency | StableCurrency | AllCurrency;

const tokenToSymbolList: Record<Currency, Hexadecimal> = {
  USDC: "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
  BRZ: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  // TODO: For now, Backed doesn't have the token on Polygon's mainnet. We'll use the same token address as DAI
  BIB01: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
} as const;

export function currencyToTokenAddress(currency: Currency): Hexadecimal {
  return tokenToSymbolList[currency];
}
