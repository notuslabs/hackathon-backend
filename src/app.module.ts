import { Module } from '@nestjs/common';
import { GetBalanceService } from './services/GetBalanceService';
import { GraphQLModule, registerEnumType } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GetBalanceResolver } from './graphql/resolvers/GetBalanceResolver';
import { join } from 'path';
import {
  AllCurrency,
  FiatCurrency,
  FixedIncomeCurrency,
} from './types/currency';
import { CreateUserOperationTransferResolver } from './graphql/resolvers/CreateUserOperationTransferResolver';
import { CreateUserOperationTransferService } from './services/CreateUserOperationTransferService';
import { GetAccountAbstractionAddressByOwnerResolver } from './graphql/resolvers/GetAccountAbstractionAddressByOwnerResolver';
import { GetAccountAbstractionAddressByOwnerService } from './services/GetAccountAbstractionAddressByOwnerService';
import { ExecuteUserOperationResolver } from './graphql/resolvers/ExecuteUserOperationResolver';
import { ExecuteUserOperationService } from './services/ExecuteUserOperationService';
import { BigIntScalar } from './graphql/scalars/BigInt';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './HttpExceptionFilter';
import { TransferListener } from './listeners/TransferListener';
import { SwapStableCoinsToInvestmentTokensService } from './services/SwapStableCoinsToInvestmentTokensService';
import { CacheModule } from '@nestjs/cache-manager';
import { RequestQuoteResolver } from './graphql/resolvers/RequestQuoteResolver';
import { RequestQuoteService } from './services/RequestQuoteService';
import { TransferoClient } from './TransferoClient';

registerEnumType(FiatCurrency, {
  name: 'Currency',
  description: 'The supported currencies',
});

registerEnumType(FixedIncomeCurrency, {
  name: 'FixedIncome',
  description: 'The available fixed income options',
});

registerEnumType(AllCurrency, {
  name: 'Asset',
  description: 'All assets (Union of Currency & FixedIncome)',
});

@Module({
  imports: [
    CacheModule.register(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      resolvers: {
        BigInt: BigIntScalar,
      },
      introspection: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [],
  providers: [
    TransferoClient,

    TransferListener,
    SwapStableCoinsToInvestmentTokensService,

    GetBalanceResolver,
    GetBalanceService,

    CreateUserOperationTransferResolver,
    CreateUserOperationTransferService,

    GetAccountAbstractionAddressByOwnerResolver,
    GetAccountAbstractionAddressByOwnerService,

    ExecuteUserOperationResolver,
    ExecuteUserOperationService,

    RequestQuoteResolver,
    RequestQuoteService,

    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
