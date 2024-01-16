import { ERC20 } from 'src/abis/ERC20';
import { Hexadecimal } from 'src/types/hexadecimal';
import { investmentWalletClient } from 'src/utils/clients';
import { getContract } from 'viem';

export type SwapStableCoinsToInvestmentTokensInput = {
  amount: bigint;
  sendTo: Hexadecimal;
};

export class SwapStableCoinsToInvestmentTokensService {
  async execute({ amount, sendTo }: SwapStableCoinsToInvestmentTokensInput) {
    const BCSPXToken = getContract({
      abi: ERC20,
      address: '0xA5c445c85089FF8AbF5C960842a4cF23669AE6D4', // Backed IB01 $ Treasury Bond 0-1yr (bIB01)
      walletClient: investmentWalletClient,
    });

    await BCSPXToken.write.transfer([sendTo, amount]);
  }
}
