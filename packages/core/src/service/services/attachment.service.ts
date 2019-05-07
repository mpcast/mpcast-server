import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import * as _ from 'lodash';
// import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Connection, In } from 'typeorm';

import { ID } from '../../common/shared-types';
import { formatOneMeta } from '../../common/utils';
import { Post as PostEntity, PostMeta } from '../../entity';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectConnection() private connection: Connection,
  ) {
  }

  /**
   *  根据 Id 查询
   * @param id
   */
  async findById(id: ID) {
    return await this.connection.getRepository(PostEntity)
      .findOne({
        id,
      });
  }

  async getFormatData(item: PostEntity) {
    // let resultData: any;
    switch (item.type) {
      case 'post-format-audio': {
        // 查询附件信息
        // post-format 为 audio 的数据 block 只有一项对应的音频内容
        // page 类型的内容才为列表
        if (!_.isEmpty(item.block)) {
          // console.log(JSON.parse(item.block)[0]);
          // console.log(item.block[0]);
          const postId = JSON.parse(item.block)[0];
          const block = await this.getAttachmentInfo(postId);
          if (!Object.is(block.meta._attachment_file, undefined)) {
            item.guid = block.meta._attachment_file;
            // resultData = item;
          }
          if (!Object.is(block.meta._attachment_metadata, undefined)) {
            if (block.meta._attachment_metadata !== '{}') {
              item = _.extend(item, block.meta._attachment_metadata);
            }
          }
        }
        Reflect.deleteProperty(item, 'meta');
        break;
      }
      default:
        // Reflect.deleteProperty(item, 'meta');
        break;
    }
    // return resultData;
    return item;
  }

  /**
   * @param id
   */
  private async getAttachmentInfo(id: ID): Promise<any> {
    const data = await this.findById(id);
    return formatOneMeta(data);
  }

  /**
   * 根据附件 id 列表获取附件内容
   * @param ids
   */
  private async getAudios(ids: number[]) {
    this.connection.manager
      .createQueryBuilder(PostEntity, 'post')
      .orderBy(`INSTR (',${ids},', CONCAT(',',id,','))`);
    // .addOrderBy(`INSTR (',${ids},', CONCAT(',',id,','))`, {})
    // let list = await this.postRepository.createQueryBuilder('p')
    // let list = await this.postRepository.find({
    //   relations: ['metas'],
    //   where: {
    //     id: In(ids),
    //   },
    // })
    // .then(a => {
    // });
  }

  // async createPost(post): Promise<Post> {
  //   return await this.postRepository.save(post);
  // }

  /**
   * 从元数据中提取附件信息
   * @param type 附件类型
   * @param postId 对象 id
   */
  async getAttachment(postId: number, type: string = 'file') {
    let where = {
      postId,
    };
    switch (type) {
      case 'file': {
        where = _.extend({ key: '_attachment_file' }, where);
        const attachment = await this.connection.manager
          .createQueryBuilder()
          .select()
          .from(PostMeta, 'pm')
          .where(`pm.key = :key AND pm.postId = :postId`, { key: '_attachment_file', postId })
          .getRawOne();
        if (!_.isEmpty(attachment)) {
          return JSON.parse(attachment.value);
        }
        break;
      }
      case 'meta':
        break;
    }
  }

  /**
   * 根据 id 列表批量获取附件
   * @param ids
   */
  async getAttachments(ids: number[]) {
    let where = {
      postId: In(ids),
    };
    where = _.extend({ key: '_attachment_file' }, where);
    const list = await this.connection.getRepository(PostMeta)
      .find({
        where,
      });

    return list;
  }
}
