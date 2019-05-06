import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ApiModule } from './api/api.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CorsMiddleware } from './middlewares/cors.middleware';
import { OriginMiddleware } from './middlewares/origin.middleware';

@Module({
  imports: [ConfigModule, ApiModule],
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {
  }

  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    // 根据不同路径处理配置路由中间件
    // const defaultMiddleware: Array<{ handler: RequestHandler; route?: string }> = [
    // { handler: i18nextHandler, route: adminApiPath },
    // ];
    // const allMiddleware = defaultMiddleware.concat(this.configService.middleware);
    // for (const [route, handlers] of Object.entries(middlewareByRoute)) {
    //   consumer.apply(...handlers).forRoutes(route);
    // }
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
