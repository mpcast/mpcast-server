import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { CacheModule } from '../cache/cache.module';
import { HttpCacheInterceptor } from '../interceptors/cache.interceptor';
import { ServiceModule } from '../service/service.module';

import { RestApiModule } from './api-internal-modules';
import { JwtAuthGuard } from './middleware/guards/auth.guard';
import { HumanizedJwtAuthGuard } from './middleware/guards/humanized-auth.guard';

@Module({
  imports: [
    CacheModule,
    ServiceModule,
    RestApiModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: HumanizedJwtAuthGuard,
    },
  ],
})
export class ApiModule {

}
