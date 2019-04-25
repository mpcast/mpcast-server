import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Post, PostMeta, Term, TermRelationships, TermTaxonomy, User } from '@app/entity';
import { Connection, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ID } from '@app/common/shared-types';
import * as _ from 'lodash';
// import { rpc } from 'qiniu';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { EBlockFormatType, ECountBy } from '@app/interfaces/conditions.interface';
import { formatAllMeta, formatOneMeta } from '@app/common/utils';
import { OptionService } from '@app/modules/options/option.service';

// import { annotateWithChildrenErrors } from 'graphql-tools/dist/stitching/errors';

@Injectable()
export class PostService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    // private optionsService
    private readonly optionService: OptionService,
  ) {
  }

  // async findById(id: ID) {
  //   let data = await this.postRepository.findOne({
  //     id,
  //   });
  // }

  /**
   * 根据 ID 查找
   * @param id
   */
  async findById(id: ID) {
    const data = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    return data;
  }

  // private async typeIsPage(data: Post) {
  // const stickys = this.opti
  // }
  async loadBLock(type: EBlockFormatType = EBlockFormatType.ALBUM, blocks: number[]) {
    // 1 取出 BLOCK 的所有内容，包含内容的 meta 信息
    const dataList = await this.connection.manager.createQueryBuilder()
      .select()
      .from(Post, 'p')
      .where(`id IN (:blocks)`, { blocks })
      // 保持数组顺序
      .orderBy(`INSTR (',${blocks},', CONCAT(',',id,','))`)
      .getRawMany();
    formatAllMeta(dataList);

    // 1 查出 block list
    // 2 查出 block post format
    // 3 处理 post format
    // for (let item of dataList) {
    // }
  }

  async getFormatData(item: Post) {
    switch (item.type) {
      case 'post-format-audio': {
        // 查询附件信息
        // post-format 为 audio 的数据 block 只有一项对应的音频内容
        // page 类型的内容才为列表
        if (!_.isEmpty(item.block)) {
          const block = await this.getAttachmentInfo(item.block[0]);
          console.log('block ids .....');
          console.log(block);
          if (!Object.is(block.meta._attachment_file, undefined)) {
            item.guid = block.meta._attachment_file;
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
        Reflect.deleteProperty(item, 'meta');
        break;
    }
    return item;
  }

  /**
   * @param id
   */
  private async getAttachmentInfo(id: ID): Promise<any> {
    const data = await this.findById(id);
    formatOneMeta(data);
    console.log('get AttachmentInfo ');
    console.log(data);
    return data;
  }

  /**
   * 根据附件 id 列表获取附件内容
   * @param ids
   */
  private async getAudios(ids: number[]) {
    this.connection.manager
      .createQueryBuilder(Post, 'post')
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

  // private async getAttachmentInfo(item.block[0]) {}
  /**
   * 分页查询
   * @param options
   */
  async paginate(options: IPaginationOptions): Promise<Pagination<Post>> {
    // this.postRepository.findAndCount()
    return await paginate<Post>(this.postRepository, options, {
      where: {
        type: 'page',
      },
    });
  }

  /**
   * 根据类别分类法的 id 与内容状态获取内容列表
   * @param categorySlug 类别标识
   * @param status 内容状态
   * @param page 当前页
   * @param pageSize 每页的内容量
   */
  async getFromCategory(categorySlug: string, status?: string, querys?: any) {
    const pageSize = querys.pagesize ? querys.pagesize : 10;
    const page = querys.page ? querys.page * pageSize : 1;
    let where: string;
    if (_.isEmpty(status)) {
      where = `obj.status NOT IN ('trash')`;
    } else {
      where = `obj.status = '${status}'`;
    }
    let data: {
      id: string;
      author: ID,
      status: string,
      guid?: string,
      allowComment: number,
      menuOrder?: number,
      block?: JSON,
      sort: number,
      createdAt: string,
      updateAt: string,
      commentNum?: number,
      parent: number,
      mimeType?: string
      password?: string,
      title: string,
      name?: string,
      excerpt?: string,
      type: string,
      content: string,
      category: string,
      metas?: PostMeta[]
    }[];
    data = await this.connection.manager
      .createQueryBuilder()
      .select('obj.*, tt.description as category')
      .from(Term, 't')
      .innerJoin(query => {
        return query.from(TermTaxonomy, 'tt');
      }, 'tt', 'tt.id = t.id')
      .innerJoin(query => {
        return query.from(TermRelationships, 'tr');
      }, 'tr', 'tr.taxonomyId = tt.id')
      .innerJoin(query => {
        return query.from(Post, 'obj');
      }, 'obj', 'obj.id = tr.objectId')
      .where('obj.type = :type', { type: 'page' })
      .andWhere(where)
      // .andWhere('obj.status IN (:status)', { status: 'publish' })
      .andWhere('t.slug = :categorySlug', { categorySlug })
      .orderBy('obj.updatedAt', 'DESC')
      .offset(page)
      .limit(pageSize)
      .getRawMany();
    // 以下处理元数据
    const objIds = [];
    data.forEach(item => {
      objIds.push(item.id);
    });
    if (!_.isEmpty(objIds)) {
      const metaData = await this.connection.getRepository(PostMeta).find({
        post: In(objIds),
      });
      data.forEach(item => {
        item.metas = _.filter(metaData, { id: item.id });
      });
    }
    return data;
  }

  /**
   * 按热度（浏览量）查询
   * @param isRandom
   * @param limit
   */
  async getPopular(isRandom: boolean = false, limit: number = 10): Promise<any> {
    let data: any;
    const orderBy: any = !isRandom ? { viewCount: 'DESC' } : 'rand()';
    data = await this.connection.manager
      .createQueryBuilder()
      .select('p.*, JSON_LENGTH(value) as viewCount')
      .from(Post, 'p')
      .innerJoin(query => {
        return query.from(PostMeta, 'meta');
      }, 'meta', 'meta.postId = p.id')
      .where('meta.key = :key', { key: '_post_views' })
      .orderBy(orderBy)
      .limit(limit)
      .getRawMany();
    return data;
  }

  /**
   * 获取最新增加的记录
   * @param limit
   */
  async getNews(limit: number): Promise<any> {
    let data: {
      id: string;
      author: ID,
      status: string,
      guid?: string,
      allowComment: number,
      menuOrder?: number,
      block?: JSON,
      sort: number,
      createdAt: string,
      updateAt: string,
      commentNum?: number,
      parent: number,
      mimeType?: string
      password?: string,
      title: string,
      name?: string,
      excerpt?: string,
      type: string,
      content: string,
      category: string,
      metas?: PostMeta[]
    }[];
    data = await this.connection.manager
      .createQueryBuilder()
      .select('obj.*, tt.description as category')
      .from(Term, 't')
      .innerJoin(query => {
        return query.from(TermTaxonomy, 'tt');
      }, 'tt', 'tt.id = t.id')
      .innerJoin(query => {
        return query.from(TermRelationships, 'tr');
      }, 'tr', 'tr.taxonomyId = tt.id')
      .innerJoin(query => {
        return query.from(Post, 'obj');
      }, 'obj', 'obj.id = tr.objectId')
      .where('obj.type = :type', { type: 'page' })
      .andWhere('obj.status IN (:status)', { status: 'publish' })
      .andWhere('tt.taxonomy = :category', { category: 'category' })
      .orderBy('obj.updatedAt', 'DESC')
      .limit(limit)
      .getRawMany();

    // 以下处理元数据
    const objIds = [];
    data.forEach(item => {
      objIds.push(item.id);
    });
    if (!_.isEmpty(objIds)) {
      const metaData = await this.connection.getRepository(PostMeta).find({
        post: In(objIds),
      });
      data.forEach(item => {
        item.metas = _.filter(metaData, { id: item.id });
      });
    }
    return data;
  }

  /**
   * 根据置顶 ID 获取推荐内容
   * @param stickys
   */
  async getStickys(stickys: [number], querys?: any) {
    // const pageSize = querys.pagesize ? querys.pagesize : 10;
    // const page = querys.page ? querys.page * pageSize : 1;
    const data = await this.connection.manager
      .createQueryBuilder()
      .select()
      .from(Post, 'p')
      .where('p.id IN (:stickys)', { stickys })
      .orderBy(`INSTR (',${stickys},', CONCAT(',',id,','))`)
      // .offset(page)
      // .limit(pageSize)
      .getRawMany();
    // 以下处理元数据
    const objIds = [];
    data.forEach(item => {
      objIds.push(item.id);
    });
    if (!_.isEmpty(objIds)) {
      const metaData = await this.connection.manager
        .createQueryBuilder()
        .select()
        .from(PostMeta, 'pm')
        .where(`postId IN (:objIds)`, { objIds })
        .getRawMany();
      // const metaData = await this.connection.getRepository(PostMeta).find({
      //   post: In(objIds),
      // });
      // console.log(metaData);
      data.forEach(item => {
        item.metas = _.filter(metaData, { postId: item.id });
      });
    }
    return data;
  }

  async findAllByType(postType: any, userId: number, take: number): Promise<Post[]> {
    const where: { [key: string]: any } = {
      status: 'publish',
      type: In([postType]),
    };
    if (userId) {
      where.author = userId;
    }
    return await this.postRepository.find({
        where,
        take: take || 10,
        skip: 0,
        cache: true,
      },
    );
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
        // const attachment = await this.connection.getRepository(PostMeta)
        //   .findOne({
        //     where: {
        //       postId,
        //     },
        //   });
        const attachment = await this.connection.manager.createQueryBuilder()
          .select()
          .from(PostMeta, 'pm')
          .where(`pm.key = :key AND pm.postId = :postId`, { key: '_attachment_file', postId })
          .getRawOne();
        if (!_.isEmpty(attachment)) {
          return JSON.parse(attachment.value);
        }
        return '';
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

  /**
   * 统计浏览量、喜欢、点赞
   * @param type
   * @param postId
   */
  async countBy(type: ECountBy, postId: ID) {
    const data = await this.connection.manager.createQueryBuilder()
      .select(`JSON_LENGTH(pm.value) as count`)
      .from(PostMeta, 'pm')
      .where(`pm.postId = :postId AND pm.key = :key`, { postId, key: type })
      .getRawOne();

    if (!_.isEmpty(data)) {
      return data.count;
    }
    return 0;
  }
}
