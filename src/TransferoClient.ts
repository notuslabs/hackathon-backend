import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

export type RequestQuoteInput = {
  baseCurrency: string;
  quoteCurrency: string;
  baseCurrencySize: number;
  quoteCurrencySize: number;
  side: 'Buy' | 'Sell';
  taxId?: string;
  taxIdCountry?: string;
};

export type Quote = {
  quoteId: string;
  price: number;
  expireAt: string;
};

@Injectable()
export class TransferoClient {
  baseURL = 'https://openbanking.bit.one';
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async #getAccessToken() {
    const cachedToken = await this.cacheManager.get<string>(
      'transfero_access_token',
    );

    if (cachedToken) {
      return cachedToken;
    }

    const response = await fetch(`${this.baseURL}/auth/token`, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: '2d8357bb-57f9-4b92-a696-6df799687084/.default',
        client_id: process.env.TRANSFERO_CLIENT_ID as string,
        client_secret: process.env.TRANSFERO_CLIENT_SECRET as string,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new BadGatewayException(
        'Error on getting credentials from Transfero',
      );
    }

    const { access_token, expires_in } = (await response.json()) as {
      access_token: string;
      expires_in: number;
    };

    await this.cacheManager.set(
      'transfero_access_token',
      access_token,
      expires_in * 1000,
    );
    return access_token;
  }

  async requestQuote({
    baseCurrency,
    baseCurrencySize,
    quoteCurrency,
    quoteCurrencySize,
    side,
    taxId,
    taxIdCountry,
  }: RequestQuoteInput) {
    const response = await fetch(`${this.baseURL}/api/quote/v2/requestquote`, {
      method: 'POST',
      body: JSON.stringify({
        baseCurrency,
        baseCurrencySize,
        quoteCurrency,
        quoteCurrencySize,
        side,
        taxId,
        taxIdCountry,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.#getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new BadGatewayException('Error on requesting quote from Transfero');
    }

    return (await response.json())[0];
  }
}
