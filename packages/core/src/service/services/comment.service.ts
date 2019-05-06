import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, In, Repository } from 'typeorm';

import { IPaginationOptions, paginate, Pagination } from '../../common/paginate';
import { ID } from '../../common/shared-types';
import { formatAllMeta, formatOneMeta } from '../../common/utils';
import { CommentEntity, UserEntity } from '../../entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
  ) {
  }

  /**
   * 分页查询全部评论
   * @param options
   */
  async paginate(options: IPaginationOptions): Promise<Pagination<CommentEntity>> {
    const paginationObj = await paginate<CommentEntity>(this.connection.getRepository(CommentEntity), options, {
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
    const data = await this.connection.getRepository(CommentEntity).findOne({
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
  async create(comment: CommentEntity) {
    const data = await this.connection.getRepository(CommentEntity).save(comment);
    formatOneMeta(data);
    return data;
  }
}
