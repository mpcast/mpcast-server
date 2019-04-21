import { Controller, Get } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from '@app/entity';

// import { Post } from './post.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {
  }

  @Get()
  root(): string {
    return 'Hello World!';
  }

  // findOne(): Promise<Post> {
  //   return this.postService.findOne()
  // }
  @Get('one')
  one(): Promise<Post> {
    return this.postService.findOne(1, 'lala');
  }

  // @Get('all')
  // findAll(): Promise<Post[]> {
  //   return this.postService.findAll();
  // }
}
