import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateUserOperationTransferService } from "src/services/CreateUserOperationTransferService";
import { AllCurrency, StableCurrency } from "src/types/currency";
import { Hexadecimal } from "src/types/hexadecimal";
import { chain } from "src/utils/clients";
import { HexadecimalScalar } from "../scalars/Hexadecimal";
import { CreateUserOperationOutput } from "./CreateUserOperationWithdrawInvestmentResolver";

@Resolver()
export class CreateUserOperationTransferResolver {
	constructor(
		private createUserOperationTransferService: CreateUserOperationTransferService,
	) {}

	@Mutation(() => CreateUserOperationOutput)
	async createUserOperationTransfer(
		@Args("accountAbstractionAddress", { type: () => HexadecimalScalar })
		accountAbstractionAddress: Hexadecimal,
		@Args("amount") amount: string,
		@Args("currency", { type: () => StableCurrency }) currency: StableCurrency,
		@Args("from", { type: () => HexadecimalScalar }) from: Hexadecimal,
		@Args("to", { type: () => HexadecimalScalar }) to: Hexadecimal,
		@Args("payFeesUsing", { type: () => StableCurrency, nullable: true })
		payFeesUsing?: StableCurrency,
	): Promise<CreateUserOperationOutput> {
		const userOperationData =
			await this.createUserOperationTransferService.execute({
				accountAbstractionAddress,
				amount,
				currency,
				from,
				to,
				payFeesUsing: payFeesUsing ? AllCurrency[payFeesUsing] : undefined,
			});

		return {
			...userOperationData,
			chainId: chain.id,
		};
	}
}
