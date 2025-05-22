import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpCtx = context.switchToHttp();
    const req = httpCtx.getRequest<Request>();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    this.logger.log(`Request: ${method} ${url}`);

    return next.handle().pipe(
      tap(() =>
        this.logger.log(`Response: ${method} ${url} - ${Date.now() - now}ms`),
      ),
    );
  }
}