import { ERC20 } from 'src/abis/ERC20';
import { Currency } from 'src/types/currency';
import { Hexadecimal } from 'src/types/hexadecimal';
import { encodeFunctionData, getContract } from 'viem';
import { currencyToTokenAddress } from 'src/utils/currencyToTokenAddress';
import { Injectable } from '@nestjs/common';
import { CreateGenericUserOperationService } from 'src/services/CreateGenericUserOperationService';
import { CHAINLESS_PERMISSIONED_SWAP_ADDRESS } from 'src/constants';
import { alchemyClient } from 'src/utils/clients';

export type CreateUserOperationERC20ApproveInput = {
  from: Hexadecimal;
  currency: Currency;
  accountAbstractionAddress: Hexadecimal;
};

@Injectable()
export class CreateUserOperationERC20ApproveService {
  constructor(
    private createGenericUserOperation: CreateGenericUserOperationService,
  ) {}

  async execute({
    from,
    currency,
    accountAbstractionAddress,
  }: CreateUserOperationERC20ApproveInput) {
    const currencyContract = getContract({
      abi: ERC20,
      address: currencyToTokenAddress(currency),
      publicClient: alchemyClient,
    });

    const max_uint256 = 2n ** 256n - 1n;
    const allowance = await currencyContract.read.allowance([
      accountAbstractionAddress,
      CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
    ]);

    if (allowance == max_uint256) {
      return;
    }

    const approveData = encodeFunctionData({
      abi: ERC20,
      functionName: 'approve',
      args: [CHAINLESS_PERMISSIONED_SWAP_ADDRESS, max_uint256],
    });

    return this.createGenericUserOperation.execute({
      from,
      accountAbstractionAddress,
      contractAddress: currencyToTokenAddress(currency),
      encodedFunctionCall: approveData,
    });
  }
}
