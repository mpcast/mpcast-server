/**
 * Logging interceptor.
 * @file 日志拦截器
 * @module interceptor/logging
 */

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { isDevMode } from '@app/app.environment';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    if (!isDevMode) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest();
    const content = request.method + ' -> ' + request.url;
    console.log('+ 收到请求：', content);
    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log('- 响应请求：', content, `${Date.now() - now}ms`)),
    );
  }
}
