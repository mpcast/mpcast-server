import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from '@app/entity';
import { HttpProcessor } from '@app/decorators/http.decorator';

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
  @Get('categories/:category')
  @HttpProcessor.handle('获取类别下的内容')
  async findByCategory(@Param('category') category): Promise<any> {
    let list = [];
    switch (category) {
      case 'new' : {
        list = await this.postService.getNews(10);
        // Reflect.deleteProperty(query, 'category')
        // Reflect.deleteProperty(query, 'rand')
        // list = await this.model('posts', {appId: this.appId}).getNews(this.get('page'), this.get('pagesize'), query)
        break;
      }
      case 'popular': {
        list = await this.postService.getPopular();
        // list = await this.model('posts', {appId: this.appId}).getPopular(query, this.get('page'), this.get('pagesize') ? this.get('pagesize') : 6, rand)
        break;
      }
      case 'featured': {
        // const stickys = this.options.stickys
        // list = await this.model('posts', {appId: this.appId}).getStickys(stickys, this.get('page'), this.get('pagesize'))
        break;
      }
      default: {
        // Reflect.deleteProperty(query, 'category')
        // Reflect.deleteProperty(query, 'rand');
        // list = await this.model('posts', { appId: this.appId })
        //   .findByCategory(query, this.get('page'), this.get('pagesize'), rand);
      }
    }
    return list;
  }
}
