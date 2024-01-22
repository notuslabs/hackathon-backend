import { Resolver, Mutation, Args, registerEnumType } from '@nestjs/graphql';
import { RequestQuoteService } from 'src/services/RequestQuoteService';
import { QuoteModel } from '../models/QuoteModel';
import { FiatCurrency } from 'src/types/currency';

@Resolver()
export class RequestQuoteResolver {
  constructor(private requestQuoteService: RequestQuoteService) {}

  @Mutation(() => QuoteModel)
  async requestQuote(
    @Args('from', { type: () => FiatCurrency }) from: FiatCurrency,
    @Args('to') to: string,
    @Args('amount') amount: number,
  ): Promise<QuoteModel> {
    const quote = await this.requestQuoteService.execute({
      from,
      to,
      amount,
    });

    return quote;
  }
}
