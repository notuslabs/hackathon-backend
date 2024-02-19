import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { RequestQuoteService } from "src/services/RequestQuoteService";
import { FiatCurrency, StableCurrency } from "src/types/currency";
import { QuoteModel } from "../models/QuoteModel";

@Resolver()
export class RequestWithdrawQuoteResolver {
	constructor(private requestQuoteService: RequestQuoteService) {}

	@Mutation(() => QuoteModel)
	async requestWithdrawQuote(
		@Args("from", { type: () => StableCurrency }) from: StableCurrency,
		@Args("to", { type: () => FiatCurrency }) to: FiatCurrency,
		@Args("amount") amount: number,
	): Promise<QuoteModel> {
		const quote = await this.requestQuoteService.execute({
			fiat: to,
			crypto: from,
			amount,
			side: "Sell",
		});

		return quote;
	}
}
