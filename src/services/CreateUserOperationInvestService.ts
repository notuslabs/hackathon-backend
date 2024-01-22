import { ChainlessPermissionedSwap } from 'src/abis/ChainlessPermissionedSwap';
import {
  FiatCurrency,
  FixedIncomeCurrency,
  currencyDecimals,
} from 'src/types/currency';
import { Hexadecimal } from 'src/types/hexadecimal';
import { encodeFunctionData, parseUnits } from 'viem';
import { currencyToTokenAddress } from 'src/utils/currencyToTokenAddress';
import { Injectable } from '@nestjs/common';
import { CreateGenericUserOperationService } from './CreateGenericUserOperationService';
import { CHAINLESS_PERMISSIONED_SWAP_ADDRESS } from 'src/constants';

export type CreateUserOperationInvestInput = {
  from: Hexadecimal;
  accountAbstractionAddress: Hexadecimal;
  amount: string;
  currency: FiatCurrency;
  asset: FixedIncomeCurrency;
};

@Injectable()
export class CreateUserOperationInvestService {
  constructor(
    private createGenericUserOperation: CreateGenericUserOperationService,
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

    return this.createGenericUserOperation.execute({
      from,
      accountAbstractionAddress,
      contractAddress: CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
      encodedFunctionCall: investData,
    });
  }
}
