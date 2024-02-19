import { Injectable } from "@nestjs/common";
import { ENTRY_POINT_ADDRESS } from "src/constants";
import { UserOperation } from "src/types/useroperation";
import { bundlerClient } from "src/utils/clients";
import { avalanche } from "viem/chains";

export type ExecuteUserOperationInput = {
	userOperations: UserOperation[];
};

@Injectable()
export class ExecuteUserOperationService {
	async execute({ userOperations }: ExecuteUserOperationInput) {
		const userOpReceipts = await Promise.all(
			userOperations.map(async (userOperation) => {
				const options = {
					method: "POST",
					headers: {
						accept: "application/json",
						"content-type": "application/json",
					},
					body: JSON.stringify({
						method: "eth_sendUserOperation",
						params: [
							{
								...userOperation,
								callGasLimit: `0x${userOperation.callGasLimit.toString(16)}`,
								preVerificationGas: `0x${userOperation.preVerificationGas.toString(16)}`,
								verificationGasLimit: `0x${userOperation.verificationGasLimit.toString(16)}`,
								maxFeePerGas: `0x${userOperation.maxFeePerGas.toString(16)}`,
								maxPriorityFeePerGas: `0x${userOperation.maxPriorityFeePerGas.toString(16)}`,
							},
							ENTRY_POINT_ADDRESS,
						],
						id: 1695717470,
						jsonrpc: "2.0",
						chainId: avalanche.id,
					}),
				};

				const a = await fetch("https://bundler.particle.network/", options);
				const response = await a.json();

				return bundlerClient.waitForUserOperationReceipt({
					hash: response.result,
				});
			}),
		);

		return userOpReceipts;
	}
}
