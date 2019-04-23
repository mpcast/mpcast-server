import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from '@app/entity';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { OptionService } from '@app/modules/options/option.service';

// import { Post } from './post.entity';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly optionService: OptionService,
    // private readonly cacheService: CacheService,
  ) {
  }

  @Get()
  root(): string {
    return 'Hello World!';
  }

  @Get('one')
  one(): Promise<Post> {
    return this.postService.findOne(1, 'lala');
  }

  @Get('categories/:category')
  @HttpProcessor.handle('获取类别下的内容')
  async findByCategory(@Req() req, @Param('category') category): Promise<any> {
    const query = req.query;
    // console.log(query.skip)
    let list = [];
    switch (category) {
      case 'new' : {
        list = await this.postService.getNews(10);
        break;
      }
      case 'popular': {
        list = await this.postService.getPopular();
        break;
      }
      case 'featured': {
        const options = await this.optionService.load(true);
        const stickys: {
          [key: string]: [number];
        } = options.stickys;
        list = await this.postService.getStickys(stickys.default);
        break;
      }
      default: {
        list = await this.postService.getFromCategory(category, null, query);
      }
    }
    return list;
  }
}
