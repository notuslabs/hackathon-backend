import { Hexadecimal } from './hexadecimal';

export type UserOperation = {
  callData: Hexadecimal;
  sender: Hexadecimal;
  signature: Hexadecimal;
  initCode: Hexadecimal;
  paymasterAndData: Hexadecimal;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  nonce: bigint;

  callGasLimit: bigint;
  preVerificationGas: bigint;
  verificationGasLimit: bigint;
};
