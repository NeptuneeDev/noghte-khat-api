import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as clientMessages from '../../common/translation/fa/message.json';
import * as Sentry from '@sentry/node';
@Catch()
export class AllExpectionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private logger = new Logger('HTTP');
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      this.inferSystemError(exception, ctx) ??
      this.inferDateBaseErorr(exception, ctx) ??
      this.inferUnHandeledErorr(exception, ctx);
    httpAdapter.reply(ctx.getResponse(), responseBody);
    console.log(exception);
  }
  inferSystemError(exception, ctx: HttpArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    if (exception instanceof HttpException) {
      if (exception.getStatus() >= 500) {
        Sentry.captureException(exception);
        this.logger.log(`server side expection occured${exception}`);
      }
      const message =
        exception.getStatus() >= 500
          ? clientMessages.server.internalServer
          : exception.getResponse();

      return {
        statusCode: exception.getStatus(),
        timeStamp: new Date().toISOString(),
        message: message,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };
    }

    return undefined;
  }

  inferDateBaseErorr(exception, ctx: HttpArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    if (exception instanceof PrismaClientKnownRequestError) {
      Sentry.captureException(exception);
      this.logger.log(`a prisma expection occures ${exception}`);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timeStamp: new Date().toISOString(),
        message: clientMessages.server.internalServer,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };
    }
    return undefined;
  }

  inferUnHandeledErorr(exception, ctx: HttpArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    Sentry.captureException(exception);
    this.logger.log(`a new wierd expection  occures ${exception}`);

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timeStamp: new Date().toISOString(),
      message: clientMessages.server.internalServer,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };
  }
}
