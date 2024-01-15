import { Module } from '@nestjs/common';
import { GetBalanceService } from './services/GetBalanceService';
import { GraphQLModule, registerEnumType } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GetBalanceResolver } from './graphql/resolvers/GetBalanceResolver';
import { join } from 'path';
import { Currency } from './types/currency';
import { CreateUserOperationTransferResolver } from './graphql/resolvers/CreateUserOperationTransferResolver';
import { CreateUserOperationTransferService } from './services/CreateUserOperationTransferService';
import { GetAccountAbstractionAddressByOwnerResolver } from './graphql/resolvers/GetAccountAbstractionAddressByOwnerResolver';
import { GetAccountAbstractionAddressByOwnerService } from './services/GetAccountAbstractionAddressByOwnerService';
import { ExecuteUserOperationResolver } from './graphql/resolvers/ExecuteUserOperationResolver';
import { ExecuteUserOperationService } from './services/ExecuteUserOperationService';
import { BigIntScalar } from './graphql/scalars/BigInt';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './HttpExceptionFilter';

registerEnumType(Currency, {
  name: 'Currency',
  description: 'The supported currencies',
});

@Module({
  imports: [
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
    GetBalanceResolver,
    GetBalanceService,

    CreateUserOperationTransferResolver,
    CreateUserOperationTransferService,

    GetAccountAbstractionAddressByOwnerResolver,
    GetAccountAbstractionAddressByOwnerService,

    ExecuteUserOperationResolver,
    ExecuteUserOperationService,

    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
