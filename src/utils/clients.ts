import { bundlerActions } from "permissionless";
import { http, createPublicClient, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { avalanche, avalancheFuji } from "viem/chains";

export const chain =
	process.env.NODE_ENV === "production" ? avalanche : avalancheFuji;

export const alchemyClient = createPublicClient({
	chain,
	batch: {
		multicall: true,
	},
	transport: http(process.env.ALCHEMY_HTTP_API_URL),
}).extend(bundlerActions);

export const bundlerClient = createPublicClient({
	chain,
	batch: {
		multicall: true,
	},
	transport: http("https://bundler.particle.network/"),
}).extend(bundlerActions);

export const investmentWalletClient = createWalletClient({
	chain,
	transport: http(process.env.ALCHEMY_HTTP_API_URL),
	account: privateKeyToAccount(
		process.env.WALLET_INVESTMENT_POOL_PRIVATE_KEY as `0x${string}`,
	),
});
