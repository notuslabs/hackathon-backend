import { Injectable } from "@nestjs/common";
import { EntryPointABI } from "src/abis/EntryPointABI";
import { ENTRY_POINT_ADDRESS } from "src/constants";
import { UserOperation } from "src/types/useroperation";
import { alchemyClient } from "src/utils/clients";
import { avalanche } from "viem/chains";

export type ExecuteUserOperationInput = {
	userOperations: UserOperation[];
};

@Injectable()
export class ExecuteUserOperationService {
	async execute({ userOperations }: ExecuteUserOperationInput) {
		try {
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
									nonce: `0x${userOperation.nonce.toString(16)}`,
									callGasLimit: `0x${userOperation.callGasLimit.toString(16)}`,
									preVerificationGas: `0x${userOperation.preVerificationGas.toString(
										16,
									)}`,
									verificationGasLimit: `0x${userOperation.verificationGasLimit.toString(
										16,
									)}`,
									maxFeePerGas: `0x${userOperation.maxFeePerGas.toString(16)}`,
									maxPriorityFeePerGas: `0x${userOperation.maxPriorityFeePerGas.toString(
										16,
									)}`,
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

					for (let i = 0; i < 10; i++) {
						try {
							const block = await alchemyClient.getBlock({
								blockTag: "latest",
							});

							const logs = await alchemyClient.getContractEvents({
								address: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
								abi: EntryPointABI,
								eventName: "UserOperationEvent",
								args: {
									userOpHash: response.result,
								},
								fromBlock: block.number - 100n,
								toBlock: block.number,
							});

							if (
								logs[0].args.success === undefined ||
								logs[0].args.userOpHash === undefined ||
								logs[0].args.actualGasUsed === undefined ||
								logs[0].transactionHash === undefined
							) {
								throw new Error("Undefined");
							}

							return {
								success: logs[0].args.success,
								userOpHash: logs[0].args.userOpHash,
								actualGasCost: logs[0].args.actualGasUsed,
								receipt: {
									transactionHash: logs[0].transactionHash,
								},
							};
						} catch (error) {
							await new Promise((resolve) => setTimeout(resolve, 4000));
							console.log(error);
						}
					}
					throw "Error, too many requests";
				}),
			);

			return userOpReceipts;
		} catch (e) {
			console.log(e);
			throw e;
		}
	}
}
