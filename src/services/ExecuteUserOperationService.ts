import { Injectable } from "@nestjs/common";
import { ENTRY_POINT_ADDRESS } from "src/constants";
import { UserOperation } from "src/types/useroperation";
import { bundlerClient } from "src/utils/clients";

export type ExecuteUserOperationInput = {
	userOperations: UserOperation[];
};

@Injectable()
export class ExecuteUserOperationService {
	async execute({ userOperations }: ExecuteUserOperationInput) {
		const userOpReceipts = await Promise.all(
			userOperations.map(async (userOperation) => {
				return bundlerClient.waitForUserOperationReceipt({
					hash: await bundlerClient.sendUserOperation({
						userOperation,
						entryPoint: ENTRY_POINT_ADDRESS,
					}),
				});
			}),
		);

		return userOpReceipts;
	}
}
