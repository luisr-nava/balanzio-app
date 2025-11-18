import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizeInputInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Sanitizar body (sí se puede reasignar)
    if (request.body && typeof request.body === 'object') {
      request.body = this.sanitizeObject(request.body);
    }

    // Sanitizar query params (NO reasignar request.query)
    if (request.query && typeof request.query === 'object') {
      const sanitized = this.sanitizeObject(request.query);
      Object.assign(request.query, sanitized); // 👈 mutación permitida
    }

    // Sanitizar params (NO reasignar request.params)
    if (request.params && typeof request.params === 'object') {
      const sanitized = this.sanitizeObject(request.params);
      Object.assign(request.params, sanitized); // 👈 mutación permitida
    }

    return next.handle();
  }

  private sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          sanitized[key] = this.sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }

    if (typeof obj === 'string') {
      return sanitizeHtml(obj, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'recursiveEscape',
      });
    }

    return obj;
  }
}
