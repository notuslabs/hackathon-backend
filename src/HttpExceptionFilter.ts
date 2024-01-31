import { Catch, HttpException } from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { Exception } from "./shared/Exception";
import * as Sentry from "@sentry/node";
import { UnexpectedException } from "./shared/UnexpectedException";

@Catch()
export class HttpExceptionFilter implements GqlExceptionFilter {
	catch(exception: HttpException) {
		if (exception instanceof UnexpectedException) {
			Sentry.captureException(exception, {
				extra: { debugData: exception.getSensitiveData() },
			});

			return new GraphQLError(exception.message);
		}

		if (exception instanceof Exception) {
			return new GraphQLError(exception.message);
		}

		Sentry.captureException(exception);
		return new GraphQLError("Unknown error");
	}
}
