import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { UnexpectedException } from "./shared/UnexpectedException";

export type RequestDepositQuoteInput = {
	fiatCurrency: string;
	cryptoCurrency: string;
	amount: number;
	side: "Buy" | "Sell";
	taxId?: string;
	taxIdCountry?: string;
};

export type CreateSwapOrderInput = {
	quoteId?: string;
	quoteRequest?: {
		side: "Buy" | "Sell";
		quoteAmount: number;
		baseCurrency: number;
		baseAmount: string;
		quoteCurrency: string;
	};
	taxId?: string;
	name?: string;
	email?: string;
	taxIdCountry?: string;
	cryptoWithdrawalInformation?: {
		key: string;
		blockchain: string;
	};
	fiatWithdrawalInformation?: {
		key: string;
	};
	externalId?: string;
	depositBlockchain?: string;
};

export type CreateSwapOrderOutput = {
	id: string;
	currency: string;
	depositAmount: number;
	blockchain: string;
	referenceId: string;
	depositAddress: string;
	base64QRCode: string;
	expireAt: string;
};

export type Quote = {
	quoteId: string;
	price: number;
	expireAt: string;
};

@Injectable()
export class TransferoClient {
	baseURL = "https://openbanking.bit.one";
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	async #getAccessToken() {
		const cachedToken = await this.cacheManager.get<string>(
			"transfero_access_token",
		);

		if (cachedToken) {
			return cachedToken;
		}

		const response = await fetch(`${this.baseURL}/auth/token`, {
			method: "POST",
			body: new URLSearchParams({
				grant_type: "client_credentials",
				scope: "2d8357bb-57f9-4b92-a696-6df799687084/.default",
				client_id: process.env.TRANSFERO_CLIENT_ID as string,
				client_secret: process.env.TRANSFERO_CLIENT_SECRET as string,
			}),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		if (!response.ok) {
			throw new UnexpectedException(
				"Error on getting credentials from Transfero",
				"transfero_credentials_error",
				await response.text(),
			);
		}

		const { access_token, expires_in } = (await response.json()) as {
			access_token: string;
			expires_in: number;
		};

		await this.cacheManager.set(
			"transfero_access_token",
			access_token,
			(expires_in - 120) * 1000, // 120 seconds before expiration
		);
		return access_token;
	}

	async createSwapOrder({
		quoteId,
		quoteRequest,
		taxId,
		taxIdCountry,
		cryptoWithdrawalInformation,
		email,
		externalId,
		fiatWithdrawalInformation,
		name,
		depositBlockchain,
	}: CreateSwapOrderInput): Promise<CreateSwapOrderOutput> {
		const response = await fetch(`${this.baseURL}/api/ramp/v1/swaporder`, {
			method: "POST",
			body: JSON.stringify({
				quoteId,
				quoteRequest,
				taxId,
				taxIdCountry,
				cryptoWithdrawalInformation,
				email,
				fiatWithdrawalInformation,
				externalId,
				name,
				depositBlockchain,
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${await this.#getAccessToken()}`,
			},
		});

		if (!response.ok) {
			throw new UnexpectedException(
				"Error on creating swap order from Transfero",
				"transfero_swap_order_error",
				await response.text(),
			);
		}

		return await response.json();
	}

	async requestQuote({
		fiatCurrency,
		cryptoCurrency,
		amount,
		side,
		taxId,
		taxIdCountry,
	}: RequestDepositQuoteInput) {
		const response = await fetch(`${this.baseURL}/api/quote/v2/requestquote`, {
			method: "POST",
			body: JSON.stringify({
				baseCurrency: cryptoCurrency,
				baseCurrencySize: 0,
				quoteCurrency: fiatCurrency,
				quoteCurrencySize: amount,
				side,
				taxId,
				taxIdCountry,
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${await this.#getAccessToken()}`,
			},
		});

		if (!response.ok) {
			throw new UnexpectedException(
				"Error on requesting quote from Transfero",
				"transfero_quote_error",
				await response.text(),
			);
		}

		return (await response.json())[0];
	}
}
