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
import { CreateUserOperationApproveERC20Service } from 'src/services/CreateUserOperationApproveERC20Service';
import { CHAINLESS_PERMISSIONED_SWAP_ADDRESS } from 'src/constants';

export type CreateUserOperationInvestInput = {
  from: Hexadecimal;
  accountAbstractionAddress: Hexadecimal;
  amount: string;
  currency: StableCurrency;
  asset: InvestCurrency;
};

@Injectable()
export class CreateUserOperationInvestService {
  constructor(
    private createGenericUserOperation: CreateGenericUserOperationService,
    private createUserOperationApprove: CreateUserOperationApproveERC20Service,
  ) {}

  async execute({
    from,
    amount,
    currency,
    asset,
    accountAbstractionAddress,
  }: CreateUserOperationInvestInput) {
    const investData = encodeFunctionData({
      abi: ChainlessPermissionedSwap,
      functionName: 'invest',
      args: [
        currencyToTokenAddress(asset),
        accountAbstractionAddress,
        currencyToTokenAddress(currency),
        parseUnits(amount, currencyDecimals[currency]),
      ],
    });

    const approveUserOP = await this.createUserOperationApprove.execute({
      from,
      accountAbstractionAddress,
      currency
    });

    const investUserOp = await this.createGenericUserOperation.execute({
      from,
      accountAbstractionAddress,
      contractAddress: CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
      encodedFunctionCall: investData,
      // guarantees that this will execute after the approval
      customNonce: approveUserOP ? approveUserOP.nonce + 1n : undefined,
    });

    return approveUserOP ? [approveUserOP, investUserOp] : [investUserOp];
  }
}
