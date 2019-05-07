import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Connection, In, Repository } from 'typeorm';

import { CategoriesService, OptionService } from '..';
import { IPaginationOptions, paginate, Pagination } from '../../common/paginate';
import { ID } from '../../common/shared-types';
import { EUserPostsBehavior } from '../../common/types/common-types';
import { formatAllMeta, formatOneMeta } from '../../common/utils';
import { Post as PostEntity, PostMeta, Term, TermRelationships, TermTaxonomy, User } from '../../entity';
// import { rpc } from 'qiniu';

// import { annotateWithChildrenErrors } from 'graphql-tools/dist/stitching/errors';

@Injectable()
export class PostService {
  constructor(
    @InjectConnection() private connection: Connection,
    // @InjectRepository(User) private readonly usersRepository: Repository<User>,
    // @InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>,
    // private optionsService
    private readonly categoriesService: CategoriesService,
    private readonly optionService: OptionService,
  ) {
  }

  /**
   * 根据 ID 查找
   * @param id
   */
  async findById(id: ID): Promise<PostEntity> {
    const data: PostEntity = await this.connection.getRepository(PostEntity).findOneOrFail({
      where: {
        id,
      },
    });

    return data;
  }

  // private async typeIsPage(data: Post) {
  // const stickys = this.opti
  // }
  async loadBLock(blocks: number[]) {
    // 1 取出 BLOCK 的所有内容，包含内容的 meta 信息
    const dataList = await this.connection.manager.createQueryBuilder()
      .select()
      .from(PostEntity, 'p')
      .where(`id IN (:blocks)`, { blocks })
      // 保持数组顺序
      .orderBy(`INSTR (',${blocks},', CONCAT(',',id,','))`)
      .getRawMany();
    formatAllMeta(dataList);

    // return dataList;
    // 1 查出 block list
    // 2 查出 block post format
    // 3 处理 post format

    // 用于一次性处理
    // let singleIds = []
    // 处理资源附件
    // 1 如果仅有一项内容，暂存至数组，后续批量获取
    // 2 如果有多项内容，直接批量获取
    for (const item of dataList) {
      const typeObject = await this.categoriesService.formatTermForObject(item.id) as Term;
      if (!_.isEmpty(typeObject)) {
        item.type = typeObject.slug;
        await this.getFormatData(item);
      }
    }
    return dataList;
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
    // console.log('get AttachmentInfo ');
    // console.log(data);
    // return data;
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

  // private async getAttachmentInfo(item.block[0]) {}
  /**
   * 分页查询
   * @param options
   */
  async paginate(options: IPaginationOptions): Promise<Pagination<PostEntity>> {
    // this.postRepository.findAndCount()
    return await paginate<PostEntity>(this.connection.getRepository(PostEntity), options, {
      type: 'page',
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
    let data: Array<{
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
    }>;
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
        return query.from(PostEntity, 'obj');
      }, 'obj', 'obj.id = tr.objectId')
      .where('obj.type = :type', { type: 'page' })
      .andWhere(where)
      // .andWhere('obj.status IN (:status)', { status: 'publish' })
      .andWhere('t.slug = :categorySlug', { categorySlug })
      .orderBy('obj.updatedAt', 'DESC')
      .offset(page)
      .limit(pageSize)
      .getRawMany();

    // return new pagination_1.Pagination(items, items.length, total, Math.round(total / limit), routes.next, routes.previous);

    // 以下处理元数据
    const objIds: any = [];
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
    // return new Pagination(it);
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
      .from(PostEntity, 'p')
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
    let data: Array<{
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
    }>;
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
        return query.from(PostEntity, 'obj');
      }, 'obj', 'obj.id = tr.objectId')
      .where('obj.type = :type', { type: 'page' })
      .andWhere('obj.status IN (:status)', { status: 'publish' })
      .andWhere('tt.taxonomy = :category', { category: 'category' })
      .orderBy('obj.updatedAt', 'DESC')
      .limit(limit)
      .getRawMany();
    // return await paginate<PostEntity>(this.postRepository, options, {
    //   where: {
    //     type: 'page',
    //   },
    // });
    // 以下处理元数据
    const objIds: any = [];
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
    //   const pageData = new Pagination(data, data.length, data.length, limit);
    //   return pageData;
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
      .from(PostEntity, 'p')
      .where('p.id IN (:stickys)', { stickys })
      .orderBy(`INSTR (',${stickys},', CONCAT(',',id,','))`)
      // .offset(page)
      // .limit(pageSize)
      .getRawMany();
    // 以下处理元数据
    const objIds: any = [];
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

  async findAllByType(postType: any, userId: number, take: number): Promise<PostEntity[]> {
    const where: { [key: string]: any } = {
      status: 'publish',
      type: In([postType]),
    };
    if (userId) {
      where.author = userId;
    }
    return await this.connection.getRepository(PostEntity).find({
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
   * 根据用户行为统计浏览量、喜欢、点赞
   * @param behavior
   * @param postId
   */
  async countByBehavior(behavior: EUserPostsBehavior, postId: ID) {
    const data = await this.connection.manager.createQueryBuilder()
      .select(`JSON_LENGTH(pm.value) as count`)
      .from(PostMeta, 'pm')
      .where(`pm.postId = :postId AND pm.key = :key`, { postId, key: behavior })
      .getRawOne();

    if (!_.isEmpty(data)) {
      return data.count;
    }
    return 0;
  }

  /**
   * 根据用户的内容交互行为类型返回用户列表
   */
  async getUsersByBehavior(behavior: EUserPostsBehavior, postId: ID) {
    const data = await this.connection.manager.createQueryBuilder()
    // .select(`JSON_LENGTH(pm.value) as count`)
      .select()
      .from(PostMeta, 'pm')
      .where(`pm.postId = :postId AND pm.key = :key`, { postId, key: behavior })
      .getRawOne();
    return data;
  }

  /**
   * 新增浏览者
   * @param userId
   * @param postId
   * @param ip
   */
  async newViewer(userId: ID, postId: ID, ip: any) {
    const hasViewer: any = await this.connection.getRepository(PostMeta)
      .findOne({
        post: { id: postId },
        key: EUserPostsBehavior.VIEW,
      });

    if (!hasViewer) {
      await this.connection.getRepository(PostMeta)
        .save({
          post: { id: postId },
          key: EUserPostsBehavior.VIEW,
          value: [],
        }).then(entity => {
          // console.log(entity);
          // 创新 view 行为数据
        });
    }

    const updateResult = await this.connection.createQueryBuilder()
      .update(PostMeta)
      .set({
        post: { id: postId },
        key: '_post_views',
        value: () => `JSON_ARRAY_APPEND(value, '$', JSON_OBJECT('id', '${userId}','ip', '${ip}', 'date', '${new Date().getTime()}'))`,
      })
      .where('postId = :postId AND `key` = :key', { postId, key: EUserPostsBehavior.VIEW })
      .execute();

    return updateResult;
  }

  /**
   * 更新浏览者信息`
   * @param userId
   * @param postId
   * @param ip
   */
  async updateViewer(userId: ID, postId: ID, ip: any) {
    // # JSON_SEARCH(json_doc, one_or_all, search_str[, escape_char[, path] ...])
    // https://dev.mysql.com/doc/refman/8.0/en/json-search-functions.html#function_json-search
    const updateResult = await this.connection.createQueryBuilder()
      .update(PostMeta)
      .set({
        // 处理包含数字类型值的 json，使期在 json_search 中有效
        // # 1 JSON_SEARCH 查找键值的路径
        // # 2 去掉已查询出的路径键
        // # 3 拼接要处理的路径键
        // # 4 用新值替换掉旧值
        value: () => {
          return `
            JSON_REPLACE(
              value,
                CONCAT(
                    SUBSTRING_INDEX(
                        REPLACE(
                            JSON_SEARCH(value, 'one', '${userId}', NULL, '$**.id'),
                            '"', ''
                        ),
                    '.', 1),
                  '.date'
                ),
                '${new Date().getTime()}',
                CONCAT(
                    SUBSTRING_INDEX(
                        REPLACE(
                            JSON_SEARCH(value, 'one', '${userId}', NULL, '$**.id'),
                            '"', ''
                        ),
                    '.', 1),
                  '.ip'
              ),
             '${ip}'
            )`;
        },
      })
      .where('postId = :postId AND `key` = :key', { postId, key: EUserPostsBehavior.VIEW })
      .execute();

    return updateResult;
  }
}
