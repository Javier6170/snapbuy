import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException/*  */
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;/*  */

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : { message: 'Internal server error' };

    this.logger.error(`Status ${status} Error: ${JSON.stringify(message)}`);

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
