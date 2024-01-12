import { Injectable } from '@nestjs/common';
import { ENTRY_POINT_ADDRESS } from 'src/constants';
import { UserOperation } from 'src/types/useroperation';
import { alchemyClient } from 'src/utils/clients';

export type ExecuteUserOperationInput = {
  userOperation: UserOperation;
};

@Injectable()
export class ExecuteUserOperationService {
  async execute({ userOperation }: ExecuteUserOperationInput) {
    const userOpHash = await alchemyClient.sendUserOperation({
      userOperation,
      entryPoint: ENTRY_POINT_ADDRESS,
    });

    return userOpHash;
  }
}
