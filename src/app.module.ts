import { Module } from "@nestjs/common";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { GetBalanceService } from "./services/GetBalanceService";
import { GraphQLModule, registerEnumType } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GetBalanceResolver } from "./graphql/resolvers/GetBalanceResolver";
import { join } from "path";
import {
	AllCurrency,
	StableCurrency,
	InvestCurrency,
	FiatCurrency,
} from "./types/currency";
import { CreateGenericUserOperationService } from "./services/CreateGenericUserOperationService";
import { CreateUserOperationERC20ApproveResolver } from "./graphql/resolvers/CreateUserOperationERC20Approve";
import { CreateUserOperationERC20ApproveService } from "./services/CreateUserOperationERC20ApproveService";
import { CreateUserOperationTransferResolver } from "./graphql/resolvers/CreateUserOperationTransferResolver";
import { CreateUserOperationTransferService } from "./services/CreateUserOperationTransferService";
import { CreateUserOperationInvestResolver } from "./graphql/resolvers/CreateUserOperationInvestResolver";
import { CreateUserOperationInvestService } from "./services/CreateUserOperationInvestService";
import { CreateUserOperationWithdrawInvestmentResolver } from "./graphql/resolvers/CreateUserOperationWithdrawInvestmentResolver";
import { CreateUserOperationWithdrawInvestmentService } from "./services/CreateUserOperationWithdrawInvestmentService";
import { GetAccountAbstractionAddressByOwnerResolver } from "./graphql/resolvers/GetAccountAbstractionAddressByOwnerResolver";
import { GetAccountAbstractionAddressByOwnerService } from "./services/GetAccountAbstractionAddressByOwnerService";
import { ExecuteUserOperationResolver } from "./graphql/resolvers/ExecuteUserOperationResolver";
import { ExecuteUserOperationService } from "./services/ExecuteUserOperationService";
import { BigIntScalar } from "./graphql/scalars/BigInt";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./HttpExceptionFilter";
import { InvestmentListener } from "./listeners/InvestmentListener";
import { SwapStableCoinsToInvestmentTokensService } from "./services/SwapStableCoinsToInvestmentTokensService";
import { CacheModule } from "@nestjs/cache-manager";
import { RequestDepositQuoteResolver } from "./graphql/resolvers/RequestDepositQuoteResolver";
import { TransferoClient } from "./TransferoClient";
import { DepositFiatResolver } from "./graphql/resolvers/DepositFiatResolver";
import { DepositFiatService } from "./services/DepositFiatService";
import { WithdrawFiatResolver } from "./graphql/resolvers/WithdrawFiatResolver";
import { WithdrawFiatService } from "./services/WithdrawFiatService";
import { RequestWithdrawQuoteResolver } from "./graphql/resolvers/RequestWithdrawQuoteResolver";
import { RequestQuoteService } from "./services/RequestQuoteService";
import { DummyTransactionResolver } from "./graphql/resolvers/DummyTransactionResolver";
import { DateScalar } from "./graphql/scalars/Date";

registerEnumType(StableCurrency, {
	name: "StableCurrency",
	description: "The supported currencies",
});

registerEnumType(FiatCurrency, {
	name: "FiatCurrency",
	description: "The supported fiat currencies",
});

registerEnumType(InvestCurrency, {
	name: "InvestmentAsset",
	description: "The available investment options",
});

registerEnumType(AllCurrency, {
	name: "Asset",
	description: "All assets (Union of Currency & InvestmentAsset)",
});

@Module({
	imports: [
		CacheModule.register(),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			resolvers: {
				BigInt: BigIntScalar,
				Date: DateScalar,
			},
			introspection: true,
			playground: false,
			plugins: [ApolloServerPluginLandingPageLocalDefault()],
			autoSchemaFile: join(process.cwd(), "src/schema.gql"),
		}),
	],
	controllers: [],
	providers: [
		TransferoClient,

		InvestmentListener,

		SwapStableCoinsToInvestmentTokensService,
		CreateGenericUserOperationService,

		CreateUserOperationERC20ApproveResolver,
		CreateUserOperationERC20ApproveService,

		GetBalanceResolver,
		GetBalanceService,

		CreateUserOperationTransferResolver,
		CreateUserOperationTransferService,

		CreateUserOperationInvestResolver,
		CreateUserOperationInvestService,

		CreateUserOperationWithdrawInvestmentResolver,
		CreateUserOperationWithdrawInvestmentService,

		GetAccountAbstractionAddressByOwnerResolver,
		GetAccountAbstractionAddressByOwnerService,

		ExecuteUserOperationResolver,
		ExecuteUserOperationService,

		RequestDepositQuoteResolver,
		RequestWithdrawQuoteResolver,
		RequestQuoteService,

		DepositFiatResolver,
		DepositFiatService,

		WithdrawFiatResolver,
		WithdrawFiatService,

		DummyTransactionResolver,

		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class AppModule {}
