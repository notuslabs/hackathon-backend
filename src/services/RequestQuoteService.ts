import { Injectable } from '@nestjs/common';
import { TransferoClient } from 'src/TransferoClient';

export type RequestQuoteInput = {
  from: string;
  to: string;
  amount: number;
};

export type RequestQuoteOutput = {
  expiresAt: string;
  price: number;
  quoteId: string;
};

@Injectable()
export class RequestQuoteService {
  constructor(private transferoClient: TransferoClient) {}

  async execute({
    from,
    to,
    amount,
  }: RequestQuoteInput): Promise<RequestQuoteOutput> {
    const quote = await this.transferoClient.requestQuote({
      quoteCurrency: from,
      baseCurrency: to,
      baseCurrencySize: 0,
      quoteCurrencySize: amount,
      side: 'Buy',
    });

    return {
      expiresAt: quote.expireAt,
      price: quote.price,
      quoteId: quote.quoteId,
    };
  }
}
