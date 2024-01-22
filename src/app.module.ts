import { Module } from '@nestjs/common';
import { GetBalanceService } from './services/GetBalanceService';
import { GraphQLModule, registerEnumType } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GetBalanceResolver } from './graphql/resolvers/GetBalanceResolver';
import { join } from 'path';
import {
  AllCurrency,
  StableCurrency,
  InvestCurrency,
} from './types/currency';
import { CreateGenericUserOperationService } from './services/CreateGenericUserOperationService';
import { CreateUserOperationTransferResolver } from './graphql/resolvers/CreateUserOperationTransferResolver';
import { CreateUserOperationTransferService } from './services/CreateUserOperationTransferService';
import { CreateUserOperationInvestResolver } from './graphql/resolvers/CreateUserOperationInvestResolver';
import { CreateUserOperationInvestService } from './services/CreateUserOperationInvestService';
import { CreateUserOperationWithdrawResolver } from './graphql/resolvers/CreateUserOperationWithdrawResolver';
import { CreateUserOperationWithdrawService } from './services/CreateUserOperationWithdrawService';
import { GetAccountAbstractionAddressByOwnerResolver } from './graphql/resolvers/GetAccountAbstractionAddressByOwnerResolver';
import { GetAccountAbstractionAddressByOwnerService } from './services/GetAccountAbstractionAddressByOwnerService';
import { ExecuteUserOperationResolver } from './graphql/resolvers/ExecuteUserOperationResolver';
import { ExecuteUserOperationService } from './services/ExecuteUserOperationService';
import { BigIntScalar } from './graphql/scalars/BigInt';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './HttpExceptionFilter';
import { InvestmentListener } from './listeners/InvestmentListener';
import { SwapStableCoinsToInvestmentTokensService } from './services/SwapStableCoinsToInvestmentTokensService';
import { CacheModule } from '@nestjs/cache-manager';
import { RequestQuoteResolver } from './graphql/resolvers/RequestQuoteResolver';
import { RequestQuoteService } from './services/RequestQuoteService';
import { TransferoClient } from './TransferoClient';

registerEnumType(StableCurrency, {
  name: 'Currency',
  description: 'The supported currencies',
});

registerEnumType(InvestCurrency, {
  name: 'InvestmentAsset',
  description: 'The available investment options',
});

registerEnumType(AllCurrency, {
  name: 'Asset',
  description: 'All assets (Union of Currency & InvestmentAsset)',
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

    InvestmentListener,

    SwapStableCoinsToInvestmentTokensService,
    CreateGenericUserOperationService,

    GetBalanceResolver,
    GetBalanceService,

    CreateUserOperationTransferResolver,
    CreateUserOperationTransferService,

    CreateUserOperationInvestResolver,
    CreateUserOperationInvestService,

    CreateUserOperationWithdrawResolver,
    CreateUserOperationWithdrawService,

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
