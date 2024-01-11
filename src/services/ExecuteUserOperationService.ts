import { Injectable } from '@nestjs/common';
import { BundlerActions, bundlerActions } from 'permissionless';
import { ENTRY_POINT_ADDRESS } from 'src/constants';
import { UserOperation } from 'src/types/useroperation';
import { PublicClient, createPublicClient, http } from 'viem';
import { polygon, polygonMumbai } from 'viem/chains';

export type ExecuteUserOperationInput = {
  userOperation: UserOperation;
};

@Injectable()
export class ExecuteUserOperationService {
  #client: PublicClient & BundlerActions;

  constructor() {
    this.#client = createPublicClient({
      chain: process.env.NODE_ENV === 'production' ? polygon : polygonMumbai,
      transport: http(process.env.ALCHEMY_HTTP_API_URL),
    }).extend(bundlerActions);
  }

  async execute({ userOperation }: ExecuteUserOperationInput) {
    const userOpHash = await this.#client.sendUserOperation({
      userOperation,
      entryPoint: ENTRY_POINT_ADDRESS,
    });

    return userOpHash;
  }
}
