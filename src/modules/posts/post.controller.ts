import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { OptionService } from '@app/modules/options/option.service';
import * as _ from 'lodash';
import { UserService } from '@app/modules/users/user.service';
import { ECountBy } from '@app/interfaces/conditions.interface';
import { Post } from '@app/entity';
import { formatAllMeta, formatOneMeta } from '@app/common/utils';

// import { Post } from './post.entity';

@Controller('posts')
export class PostController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly optionService: OptionService,
    // private readonly cacheService: CacheService,
  ) {
  }

  /**
   * 按分页条件查询全部内容
   * @param page
   * @param limit
   */
  @Get()
  async index(@Query('page') page: number = 0, @Query('limit') limit: number = 10) {
    limit = limit > 100 ? 100 : limit;
    const data = await this.postService.paginate({
      page,
      limit,
      route: 'posts',
    });
    // 处理 meta 数据
    await this.dealData(data.items);
    return data;
  }

  @Get(':id')
  @HttpProcessor.handle('获取单个内容数据')
  async one(@Param('id') id: number) {
    // this.postService.
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
    await this.dealData(list);
    return list;
  }

  // private formatMeta(list: any[]) {
  //   const items = [];
  //   for (const item of list) {
  //     item.meta = {};
  //     if (_.has(item, 'metas') && item.metas.length > 0) {
  //       for (const meta of item.metas) {
  //         item.meta[meta.key] = meta.value;
  //       }
  //     }
  //     Reflect.deleteProperty(item, 'metas');
  //     items.push(item);
  //   }
  //   return items;
  // }
  //
  // Private methods
  //
  /**
   * 格式化单个对象的元数据信息
   * @param item
   */
  // private formatOneMeta(item: any) {
  //   item.meta = {};
  //   if (!_.isEmpty(item.metas) && item.metas.length > 0) {
  //     for (const meta of item.metas) {
  //       if (meta.key.includes('_liked_posts')) {
  //         item.liked = meta.value;
  //         // item.liked = JSON.parse(meta.meta_value);
  //         // Object.assign(item, JSON.parse(meta.meta_value))
  //       }
  //       // item.meta[meta.meta_key] = JSON.parse(meta.meta_value)
  //       item.meta[meta.key] = meta.value;
  //     }
  //   }
  //   Reflect.deleteProperty(item, 'metas');
  //   return item;
  // }

  private async dealData(data) {
    formatAllMeta(data);
    // this.formatMeta(data);
    for (const item of data) {
      if (_.has(item.meta, '_items')) {
        item.items = item.meta._items;
      }
      item.url = '';

      // 如果有音频
      if (!Object.is(item.meta._audio_id, undefined)) {
        // 音频播放地址
        item.url = await this.postService.getAttachment(item.meta._audio_id);
      }
      // 作者信息
      item.authorInfo = await this.userService.getDetailById(item.author);
      formatOneMeta(item.authorInfo);
      // this.formatOneMeta(item.authorInfo);
      if (_.has(item.authorInfo, 'meta')) {
        if (_.has(item.authorInfo.meta, 'avatar')) {
          item.authorInfo.avatarUrl = await this.postService.getAttachment(item.authorInfo.meta.avatar);
        }
        if (!Object.is(item.authorInfo.meta[`_wechat`], undefined)) {
          item.authorInfo.avatarUrl = item.authorInfo.meta[`_wechat`].avatarUrl;
        }
        // Reflect.deleteProperty(item.authorInfo, 'meta');
      }
      // Liked
      if (_.has(item.authorInfo, 'liked')) {
        Reflect.deleteProperty(item.authorInfo, 'liked');
      }
      item.likeCount = await this.postService.countBy(ECountBy.LIKE, item.id);
      // item.thumbCount = await this.postService.countBy(ECountBy.THUMB, item.id);
      item.viewCount = await this.postService.countBy(ECountBy.VIEW, item.id);
      // 留言数量
      // 如果有封面 默认是 thumbnail 缩略图，如果是 podcast 就是封面特色图片 featured_image
      if (!Object.is(item.meta._thumbnail_id, undefined) && !_.isEmpty(item.meta._thumbnail_id)) {
        // item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
        item.featured_image = await this.postService.getAttachment(item.meta._thumbnail_id);

        if (_.isEmpty(item.featured_image)) {
          // 随机封面
        } else {
        }
      }
    }
  }

  /**
   * 为查询结果添加分类信息
   * @param obj
   */
  private decoratorTerms(obj: Post) {
  }

  /**
   * 处理区块列表数据
   * @param obj
   */
  private dealBlock(obj: Post) {
    if (!_.isEmpty(obj.block)) {
    }
  }
  private formatData() {
  }
}
