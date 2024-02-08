import { Injectable } from "@nestjs/common";
import { ERC20 } from "src/abis/ERC20";
import { AllCurrency, currencyDecimals } from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";
import { alchemyClient } from "src/utils/clients";
import { currencyToTokenAddress } from "src/utils/currencyToTokenAddress";
import { formatUnits, getContract } from "viem";

export type GetBalanceInput = {
	currency: AllCurrency;
	address: Hexadecimal;
};

@Injectable()
export class GetBalanceService {
	async execute({ currency, address }: GetBalanceInput) {
		const tokensContract = getContract({
			abi: ERC20,
			address: currencyToTokenAddress(currency),
			publicClient: alchemyClient,
		});

		const balance = await tokensContract.read.balanceOf([address]);

		return {
			balance,
			formattedBalance: formatUnits(balance, currencyDecimals[currency]),
		};
	}
}
