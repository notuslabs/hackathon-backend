import { ERC20 } from 'src/abis/ERC20';
import { StableCurrency, currencyDecimals } from 'src/types/currency';
import { Hexadecimal } from 'src/types/hexadecimal';
import { encodeFunctionData, parseUnits } from 'viem';
import { currencyToTokenAddress } from 'src/utils/currencyToTokenAddress';
import { Injectable } from '@nestjs/common';
import { CreateGenericUserOperationService } from 'src/services/CreateGenericUserOperationService';

export type CreateUserOperationTransferInput = {
  to: Hexadecimal;
  from: Hexadecimal;
  currency: StableCurrency;
  accountAbstractionAddress: Hexadecimal;
  amount: string;
};

@Injectable()
export class CreateUserOperationTransferService {
  constructor(
    private createGenericUserOperation: CreateGenericUserOperationService,
  ) {}

  async execute({
    to,
    amount,
    from,
    currency,
    accountAbstractionAddress,
  }: CreateUserOperationTransferInput) {
    const transferData = encodeFunctionData({
      abi: ERC20,
      functionName: 'transfer',
      args: [to, parseUnits(amount, currencyDecimals[currency])],
    });

    return this.createGenericUserOperation.execute({
      from,
      accountAbstractionAddress,
      contractAddress: currencyToTokenAddress(currency),
      encodedFunctionCall: transferData,
    });
  }
}
