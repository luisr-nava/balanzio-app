import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { CustomLoggerService } from '../logger/logger.service';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Generar o usar request ID existente
    const requestId = request.headers['x-request-id'] || uuidv4();
    request.requestId = requestId;
    response.setHeader('X-Request-ID', requestId);

    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url}`, 'HTTP', {
      requestId,
      ip,
      userAgent,
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = response;
          const contentLength = response.get('content-length');
          const duration = Date.now() - startTime;

          this.logger.log(
            `Outgoing Response: ${method} ${url} ${statusCode} - ${duration}ms`,
            'HTTP',
            {
              requestId,
              statusCode,
              contentLength,
              duration,
            },
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          this.logger.error(
            `Request Error: ${method} ${url} - ${error.message}`,
            error.stack,
            'HTTP',
            {
              requestId,
              duration,
              errorName: error.name,
            },
          );
        },
      }),
    );
  }
}
