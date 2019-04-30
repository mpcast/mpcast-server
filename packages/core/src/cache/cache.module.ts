/**
 * Cache module.
 * @file Cache 全局模块
 * @module processor/cache/module
 */

import { CacheModule as NestCacheModule, Global, Module } from '@nestjs/common';

import { CacheService } from './cache.service';
import { CacheConfigService } from './cache.service.config';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      useClass: CacheConfigService,
      inject: [CacheConfigService],
    }),
  ],
  providers: [CacheConfigService, CacheService],
  exports: [CacheService],
})
export class CacheModule {
}
