import { Injectable, Post } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Connection, In } from 'typeorm';

import { CacheService } from '../../cache/cache.service';
import * as CACHE_KEY from '../../common/constants/cache.constant';
import { ID } from '../../common/shared-types';
import { PostMeta, Term, TermMeta, TermRelationships, TermTaxonomy } from '../../entity';

@Injectable()
export class TermService {
  constructor(
    @InjectConnection() private connection: Connection,
    // @InjectRepository(User) private readonly usersRepository: Repository<User>,
    // @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly cacheService: CacheService,
  ) {
  }

  /**
   * 根据分类法与 slug 查询分类信息
   * @param slug
   */
  async findTermBySlug(taxonomy: string, slug: string) {
    const data = await this.connection.manager
      .createQueryBuilder()
      .select()
      .from(TermTaxonomy, 'tt')
      .innerJoin(query => {
        return query.from(Term, 't');
      }, 't', 'tt.termId = t.id')
      .where('tt.taxonomy = :taxonomy', { taxonomy })
      .andWhere('t.slug = :slug', { slug })
      .getRawOne();

    return data;
  }

  /**
   * 根据类别分类法的 slug 与内容状态获取内容列表
   * @param categorySlug 类别标识
   * @param status 内容状态
   * @param page 当前页
   * @param pageSize 每页的内容量
   */
  async getFromCategory(categorySlug: string, status?: string, querys?: any) {
    const pageSize = querys.pageSize ? querys.pageSize : 10;
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
        return query.from(Post, 'obj');
      }, 'obj', 'obj.id = tr.objectId')
      .where('obj.type = :type', { type: 'page' })
      .andWhere('obj.status IN (:status)', { status: 'publish' })
      .andWhere('tt.taxonomy = :category', { category: 'category' })
      .orderBy('obj.updatedAt', 'DESC')
      .limit(limit)
      .getRawMany();

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
    return data;
  }

  /**
   * 根据置顶 ID 获取推荐内容
   * @param stickys
   */
  async getStickys(stickys: [number]) {
    const data = await this.connection.manager
      .createQueryBuilder()
      .select()
      .from(Post, 'p')
      .where('p.id IN (:stickys)', { stickys })
      .orderBy(`INSTR (',${stickys},', CONCAT(',',id,','))`)
      .getRawMany();
    return data;
  }

  // async createPost(post): Promise<Post> {
  //   return await this.postRepository.save(post);
  // }

  /**
   * 根据分类法获取分类项列表
   * @param taxonomy
   */
  async getTermsByTaxonomy(taxonomy: string) {
    const allTerms = await this.loadAllTerms();
    // <Term>
    return allTerms.filter((term: any) => {
      return term.taxonomy === taxonomy;
    }).map((t: any) => Object.assign({}, t));
  }

  /**
   * 加载全部分类信息
   * @param flag
   */
  async loadAllTerms(flag?: boolean): Promise<any> {
    if (flag) {
      await this.cacheService.set(CACHE_KEY.TERMS, null);
    }
    let ret = await this.cacheService.get(CACHE_KEY.TERMS);
    if (_.isEmpty(ret)) {
      const data: any[] = await this.connection.manager
        .createQueryBuilder()
        .select()
        .from(Term, 't')
        .innerJoin(query => {
          return query.from(TermTaxonomy, 'tt');
        }, 'tt', 't.id = tt.termId')
        .orderBy('tt.id', 'ASC')
        .getRawMany();
      // 以下处理 meta 信息
      // IN 查询处理 ids
      const ids = [];
      for (const item of data) {
        ids.push(item.termId);
      }
      // 查询 meta 数据
      const metaList = await this.connection.manager
        .createQueryBuilder()
        .select('tm.*')
        .from(TermMeta, 'tm')
        .where('termId IN (:ids)', { ids })
        .getRawMany();
      // 数据分组
      const metaGroup = _.groupBy(metaList, 'termId');
      for (const key of Object.keys(metaGroup)) {
        for (const item of data) {
          if (item.termId.toString() === key.toString()) {
            item.metas = metaGroup[key];
          }
        }
      }

      // 格式化 meta
      this.formatMeta(data);
      // 数据排序
      // 设置缓存
      await this.cacheService.set(CACHE_KEY.TERMS, data);
      ret = await this.cacheService.get(CACHE_KEY.TERMS);
    }
    return ret;
  }

  private formatMeta(list: any[]) {
    const items = [];
    for (const item of list) {
      item.meta = {};
      if (_.has(item, 'metas') && item.metas.length > 0) {
        for (const meta of item.metas) {
          item.meta[meta.key] = meta.value;
        }
      }
      Reflect.deleteProperty(item, 'metas');
      items.push(item);
    }
    return items;
  }
}
