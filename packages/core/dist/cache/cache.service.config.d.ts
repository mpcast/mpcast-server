import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/common';
export declare class CacheConfigService implements CacheOptionsFactory {
    retryStrategy(): {
        retry_strategy: (options: any) => number | Error;
    };
    createCacheOptions(): CacheModuleOptions;
}
