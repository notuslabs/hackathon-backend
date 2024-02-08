import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { GraphQLModule, registerEnumType } from "@nestjs/graphql";
import { HttpExceptionFilter } from "./HttpExceptionFilter";
import { TransferoClient } from "./TransferoClient";
import { CreateUserOperationERC20ApproveResolver } from "./graphql/resolvers/CreateUserOperationERC20Approve";
import { CreateUserOperationInvestResolver } from "./graphql/resolvers/CreateUserOperationInvestResolver";
import { CreateUserOperationSwapResolver } from "./graphql/resolvers/CreateUserOperationSwapResolver";
import { CreateUserOperationTransferResolver } from "./graphql/resolvers/CreateUserOperationTransferResolver";
import { CreateUserOperationWithdrawInvestmentResolver } from "./graphql/resolvers/CreateUserOperationWithdrawInvestmentResolver";
import { DepositFiatResolver } from "./graphql/resolvers/DepositFiatResolver";
import { ExecuteUserOperationResolver } from "./graphql/resolvers/ExecuteUserOperationResolver";
import { GetAccountAbstractionAddressByOwnerResolver } from "./graphql/resolvers/GetAccountAbstractionAddressByOwnerResolver";
import { GetBalanceResolver } from "./graphql/resolvers/GetBalanceResolver";
import { GetTransactionHistoryResolver } from "./graphql/resolvers/GetTransactionHistoryResolver";
import { RequestDepositQuoteResolver } from "./graphql/resolvers/RequestDepositQuoteResolver";
import { RequestWithdrawQuoteResolver } from "./graphql/resolvers/RequestWithdrawQuoteResolver";
import { WithdrawFiatResolver } from "./graphql/resolvers/WithdrawFiatResolver";
import { BigIntScalar } from "./graphql/scalars/BigInt";
import { DateScalar } from "./graphql/scalars/Date";
import { InvestmentListener } from "./listeners/InvestmentListener";
import { CreateGenericUserOperationService } from "./services/CreateGenericUserOperationService";
import { CreateUserOperationERC20ApproveService } from "./services/CreateUserOperationERC20ApproveService";
import { CreateUserOperationInvestService } from "./services/CreateUserOperationInvestService";
import { CreateUserOperationSwapService } from "./services/CreateUserOperationSwapService";
import { CreateUserOperationTransferService } from "./services/CreateUserOperationTransferService";
import { CreateUserOperationWithdrawInvestmentService } from "./services/CreateUserOperationWithdrawInvestmentService";
import { DepositFiatService } from "./services/DepositFiatService";
import { ExecuteUserOperationService } from "./services/ExecuteUserOperationService";
import { GetAccountAbstractionAddressByOwnerService } from "./services/GetAccountAbstractionAddressByOwnerService";
import { GetBalanceService } from "./services/GetBalanceService";
import { GetTransactionHistoryService } from "./services/GetTransactionHistoryService";
import { RequestQuoteService } from "./services/RequestQuoteService";
import { SwapStableCoinsToInvestmentTokensService } from "./services/SwapStableCoinsToInvestmentTokensService";
import { WithdrawFiatService } from "./services/WithdrawFiatService";
import {
	AllCurrency,
	FiatCurrency,
	InvestCurrency,
	StableCurrency,
} from "./types/currency";

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

		CreateUserOperationSwapResolver,
		CreateUserOperationSwapService,

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

		GetTransactionHistoryResolver,
		GetTransactionHistoryService,

		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class AppModule {}
