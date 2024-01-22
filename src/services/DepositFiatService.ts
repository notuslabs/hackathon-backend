import { Injectable } from '@nestjs/common';
import { TransferoClient } from 'src/TransferoClient';

export type DepositFiatInput = {
  quoteId: string;
  recipientAddress: string;
};

export type DepositFiatOutput = {
  pixAddress: string;
  qrCode: string;
  expiresAt: string;
};

@Injectable()
export class DepositFiatService {
  constructor(private transferoClient: TransferoClient) {}

  async execute({
    quoteId,
    recipientAddress,
  }: DepositFiatInput): Promise<DepositFiatOutput> {
    const { base64QRCode, depositAddress, expireAt } =
      await this.transferoClient.createSwapOrder({
        quoteId,
        cryptoWithdrawalInformation: {
          blockchain: 'Polygon',
          key: recipientAddress,
        },
      });

    return {
      qrCode: base64QRCode,
      expiresAt: expireAt,
      pixAddress: depositAddress,
    };
  }
}
