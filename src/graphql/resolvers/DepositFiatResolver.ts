import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { DepositFiatService } from "src/services/DepositFiatService";
import { Hexadecimal } from "src/types/hexadecimal";
import { DepositModel } from "../models/DepositModel";
import { HexadecimalScalar } from "../scalars/Hexadecimal";

@Resolver()
export class DepositFiatResolver {
	constructor(private depositFiatService: DepositFiatService) {}

	@Mutation(() => DepositModel)
	async depositFiat(
		@Args("quoteId") quoteId: string,
		@Args("recipientAddress", { type: () => HexadecimalScalar })
		recipientAddress: Hexadecimal,
		@Args("taxId") taxId: string,
	): Promise<DepositModel> {
		return await this.depositFiatService.execute({
			quoteId,
			recipientAddress,
			taxId,
		});
	}
}
