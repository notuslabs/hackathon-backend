import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { RequestQuoteService } from "src/services/RequestQuoteService";
import { FiatCurrency, StableCurrency } from "src/types/currency";
import { QuoteModel } from "../models/QuoteModel";

@Resolver()
export class RequestQuoteResolver {
  constructor(private requestQuoteService: RequestQuoteService) {}

  @Mutation(() => QuoteModel)
  async requestQuote(
    @Args('from', { type: () => FiatCurrency }) from: FiatCurrency,
    @Args('to', { type: () => FiatCurrency }) to: FiatCurrency,
    @Args('amount') amount: number,
  ): Promise<QuoteModel> {
    const quote = await this.requestQuoteService.execute({
      fiat: from,
      crypto: to,
      amount,
      side: 'Buy',
    });

		return quote;
	}
}
