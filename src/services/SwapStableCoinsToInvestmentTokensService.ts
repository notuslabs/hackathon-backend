import { ChainlessPermissionedSwap } from 'src/abis/ChainlessPermissionedSwap';
import { ERC20 } from 'src/abis/ERC20';
import { CHAINLESS_PERMISSIONED_SWAP_ADDRESS } from 'src/constants';
import { Hexadecimal } from 'src/types/hexadecimal';
import { alchemyClient, investmentWalletClient } from 'src/utils/clients';
import { getContract } from 'viem';

export type SwapStableCoinsToInvestmentTokensInput = {
  txHash: Hexadecimal;
  txNonce: bigint;
  receiveAmount: bigint;
  receiveToken: Hexadecimal;
  recipient: Hexadecimal;
  payer: Hexadecimal;
  payWith: Hexadecimal;
  payAmount: bigint;
};

export class SwapStableCoinsToInvestmentTokensService {
  async execute(fulfillData: SwapStableCoinsToInvestmentTokensInput) {
    const ChainlessSwap = getContract({
      abi: ChainlessPermissionedSwap,
      address: CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
      walletClient: investmentWalletClient,
    });

    const receiveToken = getContract({
      abi: ERC20,
      address: fulfillData.receiveToken,
      publicClient: alchemyClient,
    });

    if (
      (await receiveToken.read.balanceOf([
        CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
      ])) < fulfillData.receiveAmount
    ) {
      return;
    }

    await ChainlessSwap.write.fulfill_tx([
      fulfillData.txHash,
      fulfillData.txNonce,
      fulfillData.receiveAmount,
      fulfillData.receiveToken,
      fulfillData.recipient,
      fulfillData.payer,
      fulfillData.payWith,
      fulfillData.payAmount,
    ]);
  }
}
