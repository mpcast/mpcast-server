import { Module } from '@nestjs/common';
import { UserModule } from '@app/modules/users/user.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { CacheModule } from '@app/processors/cache/cache.module';
import { OptionController } from '@app/modules/options/option.controller';
import { OptionService } from '@app/modules/options/option.service';
import { Option } from '@app/entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, AuthModule, CacheModule, TypeOrmModule.forFeature([
    Option,
  ])],
  controllers: [OptionController],
  providers: [OptionService],
  exports: [OptionService],
})
export class OptionModule {

}
