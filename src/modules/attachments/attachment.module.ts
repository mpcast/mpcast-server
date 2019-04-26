import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity, UserEntity } from '@app/entity';
import { CacheModule } from '@app/processors/cache/cache.module';
import { AttachmentService } from '@app/modules/attachments/attachment.service';
// import { AuthModule } from '@app/modules/auth/auth.module';
// import { Users } from '@app/entity';

@Module({
  imports: [
    CacheModule,
    TypeOrmModule.forFeature([
      UserEntity,
      PostEntity,
    ]),
  ],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {

}
