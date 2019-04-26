import { Controller, Get, Param, Query, Req, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { OptionService } from '@app/modules/options/option.service';
import * as _ from 'lodash';
import { UserService } from '@app/modules/users/user.service';
import { EUserPostsBehavior } from '@app/interfaces/conditions.interface';
import { PostEntity } from '@app/entity';
import { formatAllMeta, formatOneMeta } from '@app/common/utils';
import { ID } from '@app/common/shared-types';
import { CategoriesService } from '@app/modules/categories/categories.service';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { QueryParams } from '@app/decorators/query-params.decorator';
import { Pagination } from '@app/libs/paginate';

// import { Post } from './post.entity';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly optionService: OptionService,
    private readonly categoriesService: CategoriesService,
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

  @Get('categories/:category')
  @HttpProcessor.handle('获取类别下的内容')
  async findByCategory(
    @Req() req,
    @Param('category') category,
    @Query('page') page: number = 0, @Query('limit') limit: number = 10,
  ): Promise<any> {
    const query = req.query;
    // console.log(query.skip)
    let list: any;
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
    // await this.dealData(list.items);
    await this.dealData(list);

    return list;
  }

  /**
   * 获取浏览此内容的用户列表
   * TODO: 待做分页处理
   * @param postId
   * @param req
   */
  @Get(':id/views')
  @HttpProcessor.handle('获取单个内容数据')
  async getViews(@Param('id') postId: ID, @Req() req) {
    const result = await this.postService.getUsersByBehavior(EUserPostsBehavior.VIEW, postId);
    let iView = false;
    let found = 0;
    const views = [];
    if (!_.isEmpty(result)) {
      if (!_.isEmpty(result.value)) {
        const list = JSON.parse(result.value);
        const exists = _.find(list, ['id', req.user.id]);
        if (exists) {
          iView = true;
        }
        found = list.length;
        const users = await this.userService.getUsersDetailByIds(_.filter(list, 'id'));
        views.push(...users);
      }
    }
    if (views.length > 0) {
      formatAllMeta(views);
      for (const user of views) {
        Reflect.deleteProperty(user, 'meta');
      }
    }
    return {
      found,
      iView,
      postId,
      views,
    };
  }

  /**
   * 增加或更新新浏览者
   * @param postId
   * @param req
   * @param ip
   */
  @Post(':id/views/new')
  async newViewer(@Param('id') postId: ID, @Req() req, @QueryParams() { visitors: { ip } }) {
    const result = await this.postService.getUsersByBehavior(EUserPostsBehavior.VIEW, postId);
    let iView = false;
    let viewCount = 0;
    let updateResult: any;
    if (!_.isEmpty(result)) {
      if (!_.isEmpty(result.value)) {
        const list = JSON.parse(result.value);
        viewCount = list.length;
        iView = _.find(list, item => {
          // 由于 mysql json search 函数仅支持字符查询，如果 id 为数字存储查询时会需要做特殊处理
          return item.id.toString() === req.user.id.toString();
        });
        if (!iView) {
          // 如果当前用户未普浏览过，即增加。
          // 新增加浏览者
          updateResult = await this.postService.newViewer(req.user.id, postId, ip);
          if (updateResult) {
            viewCount++;
          }
        } else {
          // 更新浏览者信息
          await this.postService.updateViewer(req.user.id, postId, ip);
        }
      }
    } else {
      // 增加新浏览者
      updateResult = await this.postService.newViewer(req.user.id, postId, ip);
      if (updateResult) {
        viewCount++;
      }
    }
    return {
      iView: true,
      viewCount,
      postId,
    };
  }

  @Get(':id')
  @HttpProcessor.handle('获取单个内容数据')
  async one(@Param('id') id: ID) {
    // this.postService.
    // return await this.postService.findById(id);
    const post = await this.postService.findById(id);
    let data: any;
    // 装饰类别
    data = await this.decoratorTerms(post);
    // 装饰作者
    switch (post.type) {
      case 'page': {
        // 处理页面类型数据
        data = await this.decoratorIsPage(data);
        break;
      }
      case 'post_format': {
        // 处理内容格式化数据
        data = await this.formatData(data);
        break;
      }
      default:
        break;
    }
    data = await this.dealBlock(data);
    Reflect.deleteProperty(data, 'meta');
    return data;
  }

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
      item.likeCount = await this.postService.countByBehavior(EUserPostsBehavior.LIKE, item.id);
      // item.thumbCount = await this.postService.countBy(EInteractionBy.THUMB, item.id);
      item.viewCount = await this.postService.countByBehavior(EUserPostsBehavior.VIEW, item.id);
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
   * @param post Post
   */
  private async decoratorTerms(post: PostEntity) {
    const data: any = {};
    data.categories = _.map(await this.categoriesService.findCategoriesByObject(post.id), 'taxonomyId');
    // 查询 post-format 是何种类型的格式分类, 比如是 audio、doc 等
    const postTermFormat = await this.categoriesService.formatTermForObject(post.id);
    if (!_.isEmpty(postTermFormat)) {
      post.type = postTermFormat.slug;
    }
    return Object.assign({}, post, PostEntity);
  }

  private async decoratorTags(data: any) {
    // post.tags
    data.tags = await this.categoriesService.getTagsByObject(data.id);
  }

  /**
   * 处理区块列表数据
   * @param obj
   */
  private async dealBlock(post: any) {
    if (!_.isEmpty(post.block)) {
      const blockList = await this.postService.loadBLock(post.block);
      post.block = blockList;
    }
    return post;
  }

  /**
   * 格式化数据
   */
  private async formatData(post: PostEntity): Promise<any> {
    return await this.postService.getFormatData(post);
  }

  /**
   * 装饰类型为 page 的数据
   * @param post
   */
  private async decoratorIsPage(post: PostEntity) {
    const options = await this.optionService.load();
    const stickys: {
      [key: string]: [number];
    } = options.stickys;
    // 精选内容标记
    const isSticky = _.find(stickys.default, id => {
      return post.id === id;
    });
    let data: any;
    if (isSticky) {
      data = Object.assign({}, post, {
        isSticky: true,
      });
    } else {
      data = Object.assign({}, post, {
        isSticky: false,
      });
    }
    return data;
  }

  // 处理标签信息
  // private async decoratorTags() {}
  // private async dealBlock() {
  // }

  // @Get('views')
  // async views() {
  // }
}
