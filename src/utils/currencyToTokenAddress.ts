import { Currency } from 'src/types/currency';

export function currencyToTokenAddress(currency: Currency): `0x${string}` {
  switch (currency) {
    case Currency.USDC:
      return process.env.NODE_ENV === 'production'
        ? '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
        : '0x19446E248a62c3CD08498F9607061F7C8f1704aF';
    case Currency.BRZ:
      return process.env.NODE_ENV === 'production'
        ? '0x4eD141110F6EeeAbA9A1df36d8c26f684d2475Dc'
        : '0x35928a20EfA22EA35dCde06Ac201440aAd2fEC05';
    case Currency.JOJO:
      return '0x907F41fE794Fe0e3562C2c3B4F35D782aDfF225F';
    case Currency.BCSPX:
      return '0x63161be482f7143Ebc407717DB2453D58d74a841';
  }
}
