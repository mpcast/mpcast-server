import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { CommentService, UserService } from '../../../service';
import { JwtAuthGuard } from '../../middleware/guards/auth.guard';

// import { Post } from './post.entity';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService,
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
  async one(@Param('id') id: any) {
    const data = await this.commentService.findById(id);
    return data;
  }
}
