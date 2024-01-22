import { ChainlessPermissionedSwap } from 'src/abis/ChainlessPermissionedSwap';
import { ERC20 } from 'src/abis/ERC20';
import { CHAINLESS_PERMISSIONED_SWAP_ADDRESS } from 'src/constants';
import { Hexadecimal } from 'src/types/hexadecimal';
import { alchemyClient, investmentWalletClient } from 'src/utils/clients';
import { getContract } from 'viem';

export type SwapStableCoinsToInvestmentTokensInput = {
  tx_hash: Hexadecimal;
  tx_nonce: bigint;
  receive_amount: bigint;
  receive_token: Hexadecimal;
  recipient: Hexadecimal;
  payer: Hexadecimal;
  pay_with: Hexadecimal;
  pay_amount: bigint;
};

export class SwapStableCoinsToInvestmentTokensService {
  async execute(fulfill_data: SwapStableCoinsToInvestmentTokensInput) {
    const ChainlessSwap = getContract({
      abi: ChainlessPermissionedSwap,
      address: CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
      walletClient: investmentWalletClient,
    });

    const receiveToken = getContract({
      abi: ERC20,
      address: fulfill_data.receive_token,
      publicClient: alchemyClient,
    });

    if (
      (await receiveToken.read.balanceOf([
        CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
      ])) < fulfill_data.receive_amount
    ) {
      return;
    }

    await ChainlessSwap.write.fulfill_tx([
      fulfill_data.tx_hash,
      fulfill_data.tx_nonce,
      fulfill_data.receive_amount,
      fulfill_data.receive_token,
      fulfill_data.recipient,
      fulfill_data.payer,
      fulfill_data.pay_with,
      fulfill_data.pay_amount,
    ]);
  }
}
