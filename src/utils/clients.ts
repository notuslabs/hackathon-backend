import { bundlerActions } from "permissionless";
import { http, createPublicClient, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygon, polygonMumbai } from "viem/chains";

export const chain =
	process.env.NODE_ENV === "production" ? polygon : polygonMumbai;

export const alchemyClient = createPublicClient({
	chain,
	batch: {
		multicall: true,
	},
	transport: http(process.env.ALCHEMY_HTTP_API_URL),
}).extend(bundlerActions);

export const investmentWalletClient = createWalletClient({
	chain,
	transport: http(process.env.ALCHEMY_HTTP_API_URL),
	account: privateKeyToAccount(
		process.env.WALLET_INVESTMENT_POOL_PRIVATE_KEY as `0x${string}`,
	),
});
