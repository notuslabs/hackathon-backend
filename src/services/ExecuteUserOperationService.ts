import { Injectable } from "@nestjs/common";
import { ENTRY_POINT_ADDRESS } from "src/constants";
import { UserOperation } from "src/types/useroperation";
import { alchemyClient, investmentWalletClient } from "src/utils/clients";

export type ExecuteUserOperationInput = {
	userOperations: UserOperation[];
};

@Injectable()
export class ExecuteUserOperationService {
	async execute({ userOperations }: ExecuteUserOperationInput) {
		const address = userOperations[0].sender;
		const balance = await alchemyClient.getBalance({ address });

		if (balance < 50000000000000000n) {
			const hash = await investmentWalletClient.sendTransaction({
				to: address,
				value: 1000000000000000000n,
			});
		}

		const userOpReceipts = await Promise.all(
			userOperations.map(async (userOperation) => {
				return alchemyClient.waitForUserOperationReceipt({
					hash: await alchemyClient.sendUserOperation({
						userOperation,
						entryPoint: ENTRY_POINT_ADDRESS,
					}),
				});
			}),
		);

		return userOpReceipts;
	}
}
