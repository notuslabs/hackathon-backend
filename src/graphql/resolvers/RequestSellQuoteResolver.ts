import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RequestSellQuoteService } from 'src/services/RequestSellQuoteService';
import { QuoteModel } from '../models/QuoteModel';

@Resolver()
export class RequestSellQuoteResolver {
  constructor(private requestSelQuoteService: RequestSellQuoteService) {}

  @Mutation(() => QuoteModel)
  async requestSellQuote(
    @Args('from') from: string,
    @Args('to') to: string,
    @Args('amount') amount: number,
  ): Promise<QuoteModel> {
    const quote = await this.requestSelQuoteService.execute({
      from,
      to,
      amount,
    });

    return quote;
  }
}
