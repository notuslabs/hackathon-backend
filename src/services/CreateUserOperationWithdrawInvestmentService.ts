import { ChainlessPermissionedSwap } from 'src/abis/ChainlessPermissionedSwap';
import {
  StableCurrency,
  InvestCurrency,
  currencyDecimals,
} from 'src/types/currency';
import { Hexadecimal } from 'src/types/hexadecimal';
import { encodeFunctionData, parseUnits } from 'viem';
import { currencyToTokenAddress } from 'src/utils/currencyToTokenAddress';
import { Injectable } from '@nestjs/common';
import { CreateGenericUserOperationService } from 'src/services/CreateGenericUserOperationService';
import { CHAINLESS_PERMISSIONED_SWAP_ADDRESS } from 'src/constants';

export type CreateUserOperationWithdrawInvestmentInput = {
  from: Hexadecimal;
  accountAbstractionAddress: Hexadecimal;
  amount: string;
  currency: StableCurrency;
  asset: InvestCurrency;
};

@Injectable()
export class CreateUserOperationWithdrawInvestmentService {
  constructor(
    private createGenericUserOperation: CreateGenericUserOperationService,
  ) {}

  async execute({
    from,
    amount,
    currency,
    asset,
    accountAbstractionAddress,
  }: CreateUserOperationWithdrawInvestmentInput) {
    const withdrawData = encodeFunctionData({
      abi: ChainlessPermissionedSwap,
      functionName: 'withdraw',
      args: [
        currencyToTokenAddress(currency),
        accountAbstractionAddress,
        currencyToTokenAddress(asset),
        parseUnits(amount, currencyDecimals[asset]),
      ],
    });

    return this.createGenericUserOperation.execute({
      from,
      accountAbstractionAddress,
      contractAddress: CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
      encodedFunctionCall: withdrawData,
    });
  }
}
