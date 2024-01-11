import 'dotenv/config';
import { ERC20 } from 'src/abis/ERC20';
import { Currency } from 'src/types/currency';
import { Hexadecimal } from 'src/types/hexadecimal';
import {
  PublicClient,
  concatHex,
  createPublicClient,
  encodeFunctionData,
  getContract,
  http,
  parseUnits,
} from 'viem';
import { currencyDecimals } from './GetBalanceService';
import { AlchemyLightAccountABI } from 'src/abis/AlchemyLightAccount';
import { currencyToTokenAddress } from 'src/utils/currencyToTokenAddress';
import { ENTRY_POINT_ADDRESS, FACTORY_ADDRESS } from 'src/constants';
import { SimpleAccountFactoryAbi } from 'src/abis/SimpleAccountFactory';
import { polygon, polygonMumbai } from 'viem/chains';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ERC4337 } from 'src/abis/ERC4337';
import { BundlerActions, bundlerActions } from 'permissionless';
import { UserOperation } from 'src/types/useroperation';

export type CreateUserOperationTransferInput = {
  to: Hexadecimal;
  from: Hexadecimal;
  currency: Currency;
  accountAbstractionAddress: Hexadecimal;
  amount: string;
};

@Injectable()
export class CreateUserOperationTransferService {
  #client: PublicClient & BundlerActions;

  constructor() {
    this.#client = createPublicClient({
      chain: process.env.NODE_ENV === 'production' ? polygon : polygonMumbai,
      transport: http(process.env.ALCHEMY_HTTP_API_URL),
    }).extend(bundlerActions);
  }

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

    const executeTransferData = encodeFunctionData({
      abi: AlchemyLightAccountABI,
      functionName: 'execute',
      args: [currencyToTokenAddress(currency), 0n, transferData], // [token_address, value, transferData]
    });

    const contract = getContract({
      abi: ERC4337,
      address: ENTRY_POINT_ADDRESS,
      publicClient: this.#client,
    });

    const [
      { maxFeePerGas, maxPriorityFeePerGas },
      gasPrice,
      isAccountAbstractionDeployed,
      nonce,
    ] = await Promise.all([
      this.#client.estimateFeesPerGas(),
      this.#client.getGasPrice(),
      this.#client.getBytecode({
        address: accountAbstractionAddress,
      }),
      contract.read.getNonce([from, 0n]),
    ]);

    if (!maxFeePerGas || !maxPriorityFeePerGas || !gasPrice) {
      throw new BadGatewayException('Could not estimate fees. Received null.');
    }

    let initCode: `0x${string}` = '0x';
    if (!isAccountAbstractionDeployed) {
      initCode = concatHex([
        FACTORY_ADDRESS,
        encodeFunctionData({
          abi: SimpleAccountFactoryAbi,
          functionName: 'createAccount',
          args: [from, 0n],
        }),
      ]);
    }

    const userOperation: UserOperation = {
      callData: executeTransferData,
      sender: accountAbstractionAddress,
      signature: '0x' as Hexadecimal,
      initCode,
      paymasterAndData: '0x' as Hexadecimal,
      maxFeePerGas: (gasPrice + maxPriorityFeePerGas) * 2n,
      maxPriorityFeePerGas: maxPriorityFeePerGas * 2n,
      nonce: nonce + 1n,
      callGasLimit: 0n,
      preVerificationGas: 0n,
      verificationGasLimit: 0n,
    };

    const { callGasLimit, preVerificationGas, verificationGasLimit } =
      await this.#client.estimateUserOperationGas({
        entryPoint: ENTRY_POINT_ADDRESS,
        userOperation: userOperation,
      });

    userOperation.callGasLimit = callGasLimit;
    userOperation.preVerificationGas = preVerificationGas;
    userOperation.verificationGasLimit = verificationGasLimit;

    return {
      userOperation: userOperation,
    };
  }
}
