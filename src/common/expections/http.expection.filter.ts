import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Catch()
export class AllExpectionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      this.inferDateBaseErorr(exception) ??
      this.inferSystemError(exception, ctx);
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    console.log(exception);
  }

  inferDateBaseErorr(exception) {
    if (exception instanceof PrismaClientKnownRequestError) {
    }
    return undefined;
  }

  
  inferSystemError(exception, ctx: HttpArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    if (exception instanceof HttpException) {
      const message = exception.getResponse();
      return {
        statusCode: HttpStatus,
        timeStamp: new Date().toISOString(),
        message: message,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };
    }

    return undefined;
  }
}
