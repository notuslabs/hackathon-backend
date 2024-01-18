import { ERC20 } from 'src/abis/ERC20';
import { Hexadecimal } from 'src/types/hexadecimal';
import { investmentWalletClient } from 'src/utils/clients';
import { getContract } from 'viem';

export type SwapStableCoinsToInvestmentTokensInput = {
  amount: bigint;
  sendTo: Hexadecimal;
};

const BCSPX = '0x63161be482f7143Ebc407717DB2453D58d74a841';

export class SwapStableCoinsToInvestmentTokensService {
  async execute({ amount, sendTo }: SwapStableCoinsToInvestmentTokensInput) {
    const BCSPXToken = getContract({
      abi: ERC20,
      address: BCSPX, // Backed IB01 $ Treasury Bond 0-1yr (bIB01)
      walletClient: investmentWalletClient,
    });

    await BCSPXToken.write.transfer([sendTo, amount]);
  }
}
