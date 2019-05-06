import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { IPaginationOptions, paginate, Pagination } from '../../common/paginate';
import { ID } from '../../common/shared-types';
import { formatAllMeta, formatOneMeta } from '../../common/utils';
import { Comment } from '../../entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectConnection() private connection: Connection,
  ) {
  }

  /**
   * 分页查询全部评论
   * @param options
   */
  async paginate(options: IPaginationOptions): Promise<Pagination<Comment>> {
    const paginationObj = await paginate<Comment>(this.connection.getRepository(Comment), options, {
      relations: ['user'],
      // 仅加载 postId
      loadRelationIds: {
        relations: ['post'],
      },
    });
    // paginationObj.
    formatAllMeta(paginationObj.items, {
      filterKey: 'user',
      cleanMeta: true,
    });
    return paginationObj;
  }

  /**
   * 根据 ID 查找
   * @param id
   */
  async findById(id: ID) {
    const data = await this.connection.getRepository(Comment).findOne({
      relations: ['user'],
      where: {
        id,
      },
    });
    formatOneMeta(data, {
      filterKey: 'user',
      cleanMeta: true,
    });
    return data;
  }

  /**
   * 创建新评论
   * @param comment
   */
  async create(comment: Comment) {
    const data = await this.connection.getRepository(Comment).save(comment);
    formatOneMeta(data);
    return data;
  }
}
