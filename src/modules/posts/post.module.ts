import { Module} from '@nestjs/common';
import { PostService } from '@app/modules/posts/post.service';
import { PostController } from '@app/modules/posts/post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@app/modules/users/user.module';
import { Post, Users } from '@app/entity';
// import { AuthModule } from '@app/modules/auth/auth.module';
// import { Users } from '@app/entity';

@Module({
  // imports: [
  //   TypeOrmModule.forFeature([Post]),
  //   AuthModule,
  // ],
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      Users,
      Post,
    ]),
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {

}
