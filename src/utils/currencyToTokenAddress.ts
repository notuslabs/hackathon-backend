import {
	AllCurrency,
	InvestCurrency,
	StableCurrency,
} from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";

type Currency = InvestCurrency | StableCurrency | AllCurrency;

export const tokenToSymbolList: Record<Currency, Hexadecimal> = {
	USDC: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
	BRZ: "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
	// TODO: For now, Backed doesn't have the token on Polygon's mainnet. We'll use the same token address as DAI
	BIB01: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
	AAVE: "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
	GHST: "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7",
	APE: "0xb7b31a6bc18e48888545ce79e83e06003be70930",
	BAL: "0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3",
	LINK: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
	COMP: "0x8505b9d2254a7ae468c0e9dd10ccea3a837aef5c",
	CRV: "0x172370d5cd63279efa6d502dab29171933a610af",
	DAI: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
	FRAX: "0x45c32fa6df82ead1e2ef74d17b76547eddfaff89",
	LDO: "0xc3c7d422809852031b44ab29eec9f1eff2a58756",
	MIMATIC: "0xa3fa99a148fa48d14ed51d610c367c61876997f1",
	MKR: "0x6f7c932e7684666c9fd1d44527765433e01ff61d",
	EURS: "0xe111178a87a3bff0c8d18decba5798827539ae99",
	SD: "0x1d734a02ef1e1f5886e66b0673b71af5b53ffa94",
	SUSHI: "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a",
	SNX: "0x50b728d8d964fd00c2d0aad81718b71311fef68a",
	TETU: "0x255707b70bf90aa112006e1b07b9aea6de021424",
	THX: "0x2934b36ca9a4b31e633c5be670c8c8b28b6aa015",
	TEL: "0xdf7837de1f2fa4631d716cf2502f8b230f1dcc32",
	USDT: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
	GRT: "0x5fe2b58c013d7601147dcdd68c143a77499f5531",
	SAND: "0xbbba073c31bf03b8acf7c28ef0738decf3695683",
	UNI: "0xb33eaad8d922b1083446dc23f610c2567fb5180f",
	WBTC: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
	WETH: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
	WMATIC: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
	RENBTC: "0xdbf31df14b66535af65aac99c32e9ea844e14501",
	YFI: "0xda537104d6a5edd53c6fbba9a898708e465260b6",
	STG: "0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590",
	GNS: "0xe5417af564e4bfda1c483642db72007871397896",
	MVX: "0x2760e46d9bb43dafcbecaad1f64b93207f9f0ed7",
	DHT: "0x8c92e38eca8210f4fcbf17f0951b198dd7668292",
	POOL: "0x25788a1a171ec66da6502f9975a15b609ff54cf6",
	WOO: "0x1b815d120b3ef02039ee11dc2d33de7aa4a8c603",
	FXS: "0x1a3acf6d19267e2d3e7f898f42803e90c9219062",
	QUICK: "0xb5c064f955d8e7f38fe0460c556a72987494ee17",
	STMATIC: "0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4",
	WSTETH: "0x03b54a6e9a984069379fae1a4fc4dbae93b3bccd",
	NEX: "0xa486c6bc102f409180ccb8a94ba045d39f8fc7cb",
} as const;

export function currencyToTokenAddress(currency: Currency): Hexadecimal {
	return tokenToSymbolList[currency];
}
