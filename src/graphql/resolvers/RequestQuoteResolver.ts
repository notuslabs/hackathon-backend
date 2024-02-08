<<<<<<< HEAD:src/graphql/resolvers/RequestQuoteResolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RequestQuoteService } from 'src/services/RequestQuoteService';
import { QuoteModel } from '../models/QuoteModel';
import { FiatCurrency } from 'src/types/currency';

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
=======
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
>>>>>>> 95dea72 (style: apply biome on all files):src/graphql/resolvers/RequestDepositQuoteResolver.ts

		return quote;
	}
}
