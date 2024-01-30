import { Injectable } from '@nestjs/common';
import { TransferoClient } from 'src/TransferoClient';

export type RequestQuoteInput = {
  crypto: string;
  fiat: string;
  amount: number;
  side: 'Buy' | 'Sell';
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
    crypto,
    fiat,
    amount,
    side,
  }: RequestQuoteInput): Promise<RequestQuoteOutput> {
    const quote = await this.transferoClient.requestQuote({
      cryptoCurrency: crypto,
      fiatCurrency: fiat,
      amount,
      side,
    });

    return {
      expiresAt: quote.expireAt,
      price: quote.price,
      quoteId: quote.quoteId,
    };
  }
}
