import { Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException) {
    if (exception instanceof Error) {
      const message = exception.message;

      return new GraphQLError(message);
    }

    return new GraphQLError("Unknown error");
  }
}
