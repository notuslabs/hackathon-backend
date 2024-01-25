import { Hexadecimal } from 'src/types/hexadecimal';
import { concatHex, encodeFunctionData, getContract } from 'viem';
import { AlchemyLightAccountABI } from 'src/abis/AlchemyLightAccount';
import { ENTRY_POINT_ADDRESS, FACTORY_ADDRESS } from 'src/constants';
import { SimpleAccountFactoryAbi } from 'src/abis/SimpleAccountFactory';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ERC4337 } from 'src/abis/ERC4337';
import { UserOperation } from 'src/types/useroperation';
import { alchemyClient } from 'src/utils/clients';

export type CreateGenericUserOperationInput = {
  from: Hexadecimal;
  accountAbstractionAddress: Hexadecimal;
  contractAddress: Hexadecimal;
  encodedFunctionCall: Hexadecimal;
  customNonce?: bigint
};

@Injectable()
export class CreateGenericUserOperationService {
  async execute({
    from,
    accountAbstractionAddress,
    contractAddress,
    encodedFunctionCall,
    customNonce,
  }: CreateGenericUserOperationInput) {
    const callData = encodeFunctionData({
      abi: AlchemyLightAccountABI,
      functionName: 'execute',
      args: [contractAddress, 0n, encodedFunctionCall],
    });

    const contract = getContract({
      abi: ERC4337,
      address: ENTRY_POINT_ADDRESS,
      publicClient: alchemyClient,
    });

    const [
      { baseFeePerGas },
      priorityFeePerGas,
      isAccountAbstractionDeployed,
      nonce,
    ] = await Promise.all([
      alchemyClient.getBlock({
        blockTag: 'latest',
      }),
      alchemyClient.request<{
        Method: 'rundler_maxPriorityFeePerGas';
        Parameters?: undefined;
        ReturnType: string;
      }>({
        method: 'rundler_maxPriorityFeePerGas',
      }),
      alchemyClient.getBytecode({
        address: accountAbstractionAddress,
      }),
      contract.read.getNonce([
        accountAbstractionAddress,
        customNonce ?? BigInt(Date.now()) << 64n,
      ]),
    ]);

    if (!baseFeePerGas) {
      throw new BadGatewayException('Could not estimate fees. Received null.');
    }

    const baseFeePlusFiftyPercent = (baseFeePerGas * (100n + 50n)) / 100n;

    const prioFeePlusFivePercent =
      (BigInt(priorityFeePerGas) * (100n + 5n)) / 100n;

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
      callData: callData,
      sender: accountAbstractionAddress,
      signature: '0x' as Hexadecimal,
      initCode,
      paymasterAndData: '0x' as Hexadecimal,
      maxFeePerGas: baseFeePlusFiftyPercent + prioFeePlusFivePercent,
      maxPriorityFeePerGas: prioFeePlusFivePercent,
      nonce,
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
