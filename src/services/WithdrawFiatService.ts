import { BadRequestException, Injectable } from '@nestjs/common';
import { TransferoClient } from 'src/TransferoClient';
import { StableCurrency, currencyDecimals } from 'src/types/currency';

export type WithdrawFiatInput = {
  quoteId: string;
  taxId: string;
  recipientPixAddress: string;
};

@Injectable()
export class WithdrawFiatService {
  constructor(private transferoClient: TransferoClient) {}

  async execute({ quoteId, recipientPixAddress, taxId }: WithdrawFiatInput) {
    const { depositAddress, expireAt, base64QRCode, currency, depositAmount } =
      await this.transferoClient.createSwapOrder({
        fiatWithdrawalInformation: {
          key: recipientPixAddress,
        },
        taxId,
        taxIdCountry: 'BRA',
        quoteId,
        depositBlockchain: 'Polygon',
      });

    const addressRegex = /ethereum:([^@]+)@.*?value=([^&]+)/;
    const blockchainDepositAddress = depositAddress
      .match(addressRegex)
      ?.at(1) as string;

    if (!currencyDecimals[currency]) {
      throw new BadRequestException('Invalid currency');
    }

    return {
      blockchainDepositAddress,
      expiresAt: expireAt,
      depositAmount,
      qrCode: base64QRCode,
      depositCurrency: currency as StableCurrency,
    };
  }
}
