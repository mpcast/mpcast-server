/**
 * Transform interceptor.
 * @file 请求流拦截器
 * @module interceptor/transform
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// @ts-ignore
import { PaginateResult } from 'mongoose';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as META from '../common/constants/meta.constant';
import * as TEXT from '../common/constants/text.constant';
import { EHttpStatus, IHttpResultPaginate, THttpSuccessResponse } from '../common/types/interfaces/http.interface';
import { TMessage } from '../common/types/interfaces/http.interface';

// 转换为标准的数据结构
export function transformDataToPaginate<T>(data: PaginateResult<T>, request?: any): IHttpResultPaginate<T[]> {
  return {
    data: data.docs,
    params: request ? request.queryParams : null,
    pagination: {
      total: data.total,
      current_page: data.page,
      total_page: data.pages,
      per_page: data.limit,
    },
  };
}

/**
 * @class TransformInterceptor
 * @classdesc 当控制器所需的 Promise service 成功响应时，将在此被转换为标准的数据结构 IHttpResultPaginate
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, THttpSuccessResponse<T>> {
  constructor(private readonly reflector: Reflector) {
  }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<THttpSuccessResponse<T>> | Promise<Observable<THttpSuccessResponse<T>>> {
    const target = context.getHandler();
    const request = context.switchToHttp().getRequest();
    const message = this.reflector.get<TMessage>(META.HTTP_SUCCESS_MESSAGE, target) || TEXT.HTTP_DEFAULT_SUCCESS_TEXT;
    const usePaginate = this.reflector.get<boolean>(META.HTTP_RES_TRANSFORM_PAGINATE, target);
    return next.handle().pipe(map((data: any) => {
      const result = !usePaginate ? data : transformDataToPaginate<T>(data, request);
      return { status: EHttpStatus.Success, message, result };
    }));
  }
}
