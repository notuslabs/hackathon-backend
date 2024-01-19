import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RequestQuoteService } from 'src/services/RequestQuoteService';
import { QuoteModel } from '../models/QuoteModel';

@Resolver()
export class RequestQuoteResolver {
  constructor(private requestSelQuoteService: RequestQuoteService) {}

  @Mutation(() => QuoteModel)
  async requestQuote(
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
