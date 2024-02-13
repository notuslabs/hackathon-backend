import { Injectable } from "@nestjs/common";
import { SimpleAccountFactoryAbi } from "src/abis/SimpleAccountFactory";
import { FACTORY_ADDRESS } from "src/constants";
import { Hexadecimal } from "src/types/hexadecimal";
import { alchemyClient, investmentWalletClient } from "src/utils/clients";
import { getContract } from "viem";

export type GetAccountAbstractionAddressByOwnerInput = {
	owner: Hexadecimal;
};

@Injectable()
export class GetAccountAbstractionAddressByOwnerService {
	async execute({ owner }: GetAccountAbstractionAddressByOwnerInput) {
		const factoryContract = getContract({
			abi: SimpleAccountFactoryAbi,
			address: FACTORY_ADDRESS,
			publicClient: alchemyClient,
		});

		const address = await factoryContract.read.getAddress([owner, 0n]);

		const balance = await alchemyClient.getBalance({ address });

		if (balance < 50000000000000000n) {
			const hash = await investmentWalletClient.sendTransaction({
				to: address,
				value: 1000000000000000000n,
			});
		}

		return address;
	}
}
