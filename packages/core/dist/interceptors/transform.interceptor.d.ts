import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PaginateResult } from 'mongoose';
import { Observable } from 'rxjs';
import { IHttpResultPaginate, THttpSuccessResponse } from '../common/types/interfaces/http.interface';
export declare function transformDataToPaginate<T>(data: PaginateResult<T>, request?: any): IHttpResultPaginate<T[]>;
export declare class TransformInterceptor<T> implements NestInterceptor<T, THttpSuccessResponse<T>> {
    private readonly reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<THttpSuccessResponse<T>> | Promise<Observable<THttpSuccessResponse<T>>>;
}
