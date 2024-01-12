import { bundlerActions } from 'permissionless';
import { createPublicClient, http } from 'viem';
import { polygon, polygonMumbai } from 'viem/chains';

export const chain =
  process.env.NODE_ENV === 'production' ? polygon : polygonMumbai;

export const alchemyClient = createPublicClient({
  chain,
  transport: http(process.env.ALCHEMY_HTTP_API_URL),
}).extend(bundlerActions);
