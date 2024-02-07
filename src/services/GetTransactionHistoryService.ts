import { Injectable } from "@nestjs/common";
import { alchemyClient } from "../utils/clients";
import {
	AssetTransfersCategory,
	AssetTransfersWithMetadataResponse,
	type AssetTransfersParams,
	AssetTransfersWithMetadataResult,
} from "alchemy-sdk";
import { Hexadecimal } from "src/types/hexadecimal";
import { TransactionModel } from "src/graphql/models/TransactionModel";
import { CHAINLESS_PERMISSIONED_SWAP_ADDRESS } from "src/constants";
import { tokenToSymbolList } from "src/utils/currencyToTokenAddress";
import { equalsIgnoringCase } from "src/utils/equalsIgnoreCase";
import { formatUnits } from "viem";
import { UnexpectedException } from "src/shared/UnexpectedException";

export type GetAssetTransfersMethod = {
	Method: "alchemy_getAssetTransfers";
	Parameters?: AssetTransfersParams;
	ReturnType: AssetTransfersWithMetadataResponse;
};

export type GetTransactionHistoryInput = {
	address: Hexadecimal;
};

@Injectable()
export class GetTransactionHistoryService {
	async execute({
		address,
	}: GetTransactionHistoryInput): Promise<TransactionModel[]> {
		const [inTransfers, outTransfers] = await Promise.all([
			alchemyClient.request<GetAssetTransfersMethod>({
				method: "alchemy_getAssetTransfers",
				params: {
					contractAddresses: Object.values(tokenToSymbolList),
					fromBlock: "0x0",
					toBlock: "indexed",
					category: [AssetTransfersCategory.ERC20],
					withMetadata: true,
					toAddress: address,
				},
			}),
			alchemyClient.request<GetAssetTransfersMethod>({
				method: "alchemy_getAssetTransfers",
				params: {
					contractAddresses: Object.values(tokenToSymbolList),
					fromBlock: "0x0",
					toBlock: "indexed",
					category: [AssetTransfersCategory.ERC20],
					withMetadata: true,
					fromAddress: address,
				},
			}),
		]);

		const transfers = inTransfers.transfers
			.concat(outTransfers.transfers)
			.sort((a, b) => {
				return (
					new Date(b.metadata.blockTimestamp).getTime() -
					new Date(a.metadata.blockTimestamp).getTime()
				);
			});

		const transactions = transfers.map((transfer) => ({
			amount: formatUnits(
				BigInt(transfer.rawContract.value ?? "0"),
				Number(transfer.rawContract.decimal),
			),
			asset: transfer.asset as string,
			timestamp: new Date(transfer.metadata.blockTimestamp),
			transactionId: transfer.hash,
			type: this.#getTypeByTransfer(address, transfer),
		}));

		return transactions;
	}

	#getTypeByTransfer(
		address: Hexadecimal,
		transaction: AssetTransfersWithMetadataResult,
	): "deposit" | "withdraw" | "invest" {
		let type: "deposit" | "withdraw" | "invest" | undefined;

		if (equalsIgnoringCase(transaction.from, address)) {
			type = "withdraw";
		}

		if (equalsIgnoringCase(transaction.to, address)) {
			type = "deposit";
		}

		if (
			equalsIgnoringCase(
				transaction.from,
				CHAINLESS_PERMISSIONED_SWAP_ADDRESS,
			) ||
			equalsIgnoringCase(transaction.to, CHAINLESS_PERMISSIONED_SWAP_ADDRESS)
		) {
			type = "invest";
		}

		if (!type)
			throw new UnexpectedException(
				"Transaction type not found",
				"TRANSACTION_TYPE_NOT_FOUND",
				{ transaction, address },
			);

		return type;
	}
}

new GetTransactionHistoryService().execute({
	address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
});
