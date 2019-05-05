import { CacheInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class HttpCacheInterceptor extends CacheInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
    trackBy(context: ExecutionContext): string | undefined;
}
