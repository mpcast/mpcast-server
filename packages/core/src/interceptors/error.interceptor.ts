/**
 * Error interceptor.
 * @file 错误拦截器
 * @module interceptor/error
 */

import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import * as META from '../common/constants/meta.constant';
import * as TEXT from '../common/constants/text.constant';
import { CustomError } from '../common/errors/custom.error';
import { TMessage } from '../common/types/interfaces/http.interface';

/**
 * @class ErrorInterceptor
 * @classdesc 当控制器所需的 Promise service 发生错误时，错误将在此被捕获
 */
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const target = context.getHandler();
    const statusCode = this.reflector.get<HttpStatus>(META.HTTP_ERROR_CODE, target);
    const message = this.reflector.get<TMessage>(META.HTTP_ERROR_MESSAGE, target) || TEXT.HTTP_DEFAULT_ERROR_TEXT;
    return next.handle().pipe(
      catchError(error => throwError(new CustomError({ message, error }, statusCode))));
  }
}
