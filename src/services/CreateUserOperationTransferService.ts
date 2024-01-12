import 'dotenv/config';
import { ERC20 } from 'src/abis/ERC20';
import { Currency } from 'src/types/currency';
import { Hexadecimal } from 'src/types/hexadecimal';
import { concatHex, encodeFunctionData, getContract, parseUnits } from 'viem';
import { currencyDecimals } from './GetBalanceService';
import { AlchemyLightAccountABI } from 'src/abis/AlchemyLightAccount';
import { currencyToTokenAddress } from 'src/utils/currencyToTokenAddress';
import { ENTRY_POINT_ADDRESS, FACTORY_ADDRESS } from 'src/constants';
import { SimpleAccountFactoryAbi } from 'src/abis/SimpleAccountFactory';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ERC4337 } from 'src/abis/ERC4337';
import { UserOperation } from 'src/types/useroperation';
import { alchemyClient } from 'src/utils/clients';
import { bigIntMax, bigIntPercent } from 'src/utils/bigint';

export type CreateUserOperationTransferInput = {
  to: Hexadecimal;
  from: Hexadecimal;
  currency: Currency;
  accountAbstractionAddress: Hexadecimal;
  amount: string;
};

@Injectable()
export class CreateUserOperationTransferService {
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
      publicClient: alchemyClient,
    });

    const [maxPriorityFeePerGas, feeData, isAccountAbstractionDeployed, nonce] =
      await Promise.all([
        alchemyClient.estimateMaxPriorityFeePerGas(),
        alchemyClient.estimateFeesPerGas(),
        alchemyClient.getBytecode({
          address: accountAbstractionAddress,
        }),
        contract.read.getNonce([accountAbstractionAddress, 0n]),
      ]);

    if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
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

    const maxPriorityFeePerGasBid = bigIntMax(
      bigIntPercent(maxPriorityFeePerGas, BigInt(133)),
      100_000_000n,
    ); // Add 33% to the maxPriorityFeePerGas or 100_000_000 wei (min required by EIP-1559)

    const maxFeePerGasBid =
      BigInt(feeData.maxFeePerGas) -
      BigInt(feeData.maxPriorityFeePerGas) +
      maxPriorityFeePerGasBid;

    const userOperation: UserOperation = {
      callData: executeTransferData,
      sender: accountAbstractionAddress,
      signature: '0x' as Hexadecimal,
      initCode,
      paymasterAndData: '0x' as Hexadecimal,
      maxFeePerGas: maxFeePerGasBid,
      maxPriorityFeePerGas: maxPriorityFeePerGasBid,
      nonce: nonce,
      callGasLimit: 0n,
      preVerificationGas: 0n,
      verificationGasLimit: 0n,
    };

    const { callGasLimit, preVerificationGas, verificationGasLimit } =
      await alchemyClient.estimateUserOperationGas({
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
