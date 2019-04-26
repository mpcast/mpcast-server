import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { CommentEntity, CommentMeta, UserEntity } from '@app/entity';
import { Connection, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination } from 'libs/paginate';
import { formatAllMeta, formatOneMeta } from '@app/common/utils';
import { ID } from '@app/common/shared-types';

@Injectable()
export class CommentService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
  ) {
  }

  /**
   * 分页查询全部评论
   * @param options
   */
  async paginate(options: IPaginationOptions): Promise<Pagination<CommentEntity>> {
    const paginationObj = await paginate<CommentEntity>(this.commentRepository, options, {
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
    const data = await this.commentRepository.findOne({
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
    const data = await this.commentRepository.save(comment);
    formatOneMeta(data);
    return data;
  }
}
