import { Injectable } from '@nestjs/common';
import { ENTRY_POINT_ADDRESS } from 'src/constants';
import { UserOperation } from 'src/types/useroperation';
import { alchemyClient } from 'src/utils/clients';

export type ExecuteUserOperationInput = {
  userOperations: UserOperation[];
};

@Injectable()
export class ExecuteUserOperationService {
  async execute({ userOperations }: ExecuteUserOperationInput) {
    const userOpHashes = await Promise.all(
      userOperations.map(userOperation =>
        alchemyClient.sendUserOperation({
          userOperation,
          entryPoint: ENTRY_POINT_ADDRESS,
        })
      )
    );

    return userOpHashes;
  }
}
