import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { RequestQuoteService } from "src/services/RequestQuoteService";
import { FiatCurrency, StableCurrency } from "src/types/currency";
import { QuoteModel } from "../models/QuoteModel";

@Resolver()
export class RequestDepositQuoteResolver {
	constructor(private requestQuoteService: RequestQuoteService) {}

	@Mutation(() => QuoteModel)
	async requestDepositQuote(
		@Args("from", { type: () => FiatCurrency }) from: FiatCurrency,
		@Args("to", { type: () => StableCurrency }) to: StableCurrency,
		@Args("amount") amount: number,
	): Promise<QuoteModel> {
		const quote = await this.requestQuoteService.execute({
			fiat: from,
			crypto: to,
			amount,
			side: "Buy",
		});

		return quote;
	}
}
