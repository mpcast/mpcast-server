import { Controller, Get, Param, Query, Req, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { OptionService } from '@app/modules/options/option.service';
import { UserService } from '@app/modules/users/user.service';
import { CategoriesService } from '@app/modules/categories/categories.service';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { AttachmentService } from '@app/modules/attachments/attachment.service';
import { formatOneMeta } from '@app/common/utils';

// import { Post } from './post.entity';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService,
    private readonly optionService: OptionService,
    private readonly categoriesService: CategoriesService,
    private readonly attachmentService: AttachmentService,
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
    const data = await this.commentService.paginate({
      page,
      limit,
      route: 'posts',
    });
    return data;
  }

  /**
   * 获取单条记录
   * @param id
   */
  @Get(':id')
  async one(@Param('id') id) {
    const data = await this.commentService.findById(id);
    return data;
  }
}
