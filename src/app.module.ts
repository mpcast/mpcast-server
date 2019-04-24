import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '@app/entity';
// import { PasswordCiper } from '@app/service/helpers/password-cipher/password-ciper';
// 拦截器
import { HttpCacheInterceptor } from '@app/interceptors/cache.interceptor';
// 中间件
import { CorsMiddleware } from '@app/middlewares/cors.middleware';
import { OriginMiddleware } from '@app/middlewares/origin.middleware';

// 公共模块
import { CacheModule } from '@app/processors/cache/cache.module';
import { HelperModule } from '@app/processors/helper/helper.module';

// 业务模块（核心）
import { AuthModule } from '@app/modules/auth/auth.module';
import { UserModule } from '@app/modules/users/user.module';
import { WechatModule } from '@app/modules/wechat/wechat.module';
import { PostModule } from '@app/modules/posts/post.module';
import { OptionModule } from '@app/modules/options/option.module';
import { CategoriesModule } from '@app/modules/categories/categories.module';
// import { AuthService } from '@app/modules/auth/auth.service';
// import { UserService } from '@app/modules/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      // port: 3306,
      port: 3399,
      username: 'root',
      password: 'abcd1234',
      database: 'podcast',
      entities: [__dirname + '/**/*.entity.ts'],
      logging: true,
      synchronize: true,
      dropSchema: false,
    }),
    CacheModule,
    HelperModule,
    AuthModule,
    UserModule,
    WechatModule,
    // 内容模块
    OptionModule,
    CategoriesModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
