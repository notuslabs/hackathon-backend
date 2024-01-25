import { BadRequestException, Injectable } from '@nestjs/common';
import { TransferoClient } from 'src/TransferoClient';
import { StableCurrency, currencyDecimals } from 'src/types/currency';
import { Hexadecimal } from 'src/types/hexadecimal';

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

    const blockchainDepositAddress = new URLSearchParams(depositAddress).get(
      'address',
    );

    if (!currencyDecimals[currency]) {
      throw new BadRequestException('Invalid currency');
    }

    return {
      blockchainDepositAddress: blockchainDepositAddress as Hexadecimal,
      expiresAt: expireAt,
      depositAmount,
      qrCode: base64QRCode,
      depositCurrency: currency as StableCurrency,
    };
  }
}
