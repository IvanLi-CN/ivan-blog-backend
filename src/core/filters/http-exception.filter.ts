import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-errors';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // const gqlHost = GqlArgumentsHost.create(host);
    const tmp: any = { ...exception };
    delete tmp.status;
    delete tmp.response;
    delete tmp.message;
    const responseData = exception.getResponse();
    let message: string;
    if (responseData instanceof String) {
      message = exception.message;
    } else {
      message = exception.message.message || exception.message.msg;
    }
    return new ApolloError(message, exception.getStatus().toString(), Object.assign(tmp, exception.message));
  }
}
