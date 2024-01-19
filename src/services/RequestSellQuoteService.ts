import { Injectable } from '@nestjs/common';
import { Quote, TransferoClient } from 'src/TransferoClient';

export type RequestSellQuoteInput = {
  from: string;
  to: string;
  amount: number;
};

@Injectable()
export class RequestSellQuoteService {
  constructor(private transferoClient: TransferoClient) {}

  async execute({ from, to, amount }: RequestSellQuoteInput): Promise<Quote> {
    const quote = await this.transferoClient.requestQuote({
      baseCurrency: from,
      quoteCurrency: to,
      baseCurrencySize: amount,
      quoteCurrencySize: 0,
      side: 'Buy',
    });

    return quote;
  }
}
