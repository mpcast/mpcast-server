import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@app/modules/users/user.module';
import { CommentEntity, UserEntity } from '@app/entity';
import { OptionModule } from '@app/modules/options/option.module';
import { CacheModule } from '@app/processors/cache/cache.module';
import { CategoriesModule } from '@app/modules/categories/categories.module';
import { AttachmentModule } from '@app/modules/attachments/attachment.module';
import { CommentController } from '@app/modules/comments/comment.controller';
import { CommentService } from '@app/modules/comments/comment.service';

@Module({
  imports: [
    AttachmentModule,
    UserModule,
    OptionModule,
    CategoriesModule,
    CacheModule,
    TypeOrmModule.forFeature([
      UserEntity,
      CommentEntity,
    ]),
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {

}
