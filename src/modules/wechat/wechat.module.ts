import { Module } from '@nestjs/common';
import { WechatController } from '@app/modules/wechat/wechat.controller';
import { UserModule } from '@app/modules/users/user.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { CacheModule } from '@app/processors/cache/cache.module';

@Module({
  imports: [UserModule, AuthModule, CacheModule],
  controllers: [WechatController],
})
export class WechatModule {

}
