import { Injectable } from '@nestjs/common';
import { Quote, TransferoClient } from 'src/TransferoClient';

export type RequestQuoteInput = {
  from: string;
  to: string;
  amount: number;
};

@Injectable()
export class RequestQuoteService {
  constructor(private transferoClient: TransferoClient) {}

  async execute({ from, to, amount }: RequestQuoteInput): Promise<Quote> {
    const quote = await this.transferoClient.requestQuote({
      quoteCurrency: from,
      baseCurrency: to,
      baseCurrencySize: 0,
      quoteCurrencySize: amount,
      side: 'Buy',
    });

    return quote;
  }
}
