import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { Post, PostMeta, Term, TermRelationships, TermTaxonomy } from '@app/entity';
import { Repository, In, Connection, OrderByCondition } from 'typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@app/entity';
import { ID } from '@app/common/shared-types';
import { IsNotEmpty } from 'class-validator';
import * as _ from 'lodash';

// import { annotateWithChildrenErrors } from 'graphql-tools/dist/stitching/errors';

@Injectable()
export class PostService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {
  }

  // async getNews(take: number) {
  // const where: {
  // }
  // return await this.postRepository.find({
  //     where,
  //     take: take || 10,
  //     skip: 0,
  //     cache: true,
  //   },
  // );
  // }

  async findOne(postId: number, name: string): Promise<Post> {
    const post: Post = await this.postRepository.findOne({
      relations: ['metas'],
      where: {
        status: 'publish',
        postId,
      },
    });
    // const post: Post | undefined = await this.postRepository.createQueryBuilder('post')
    //   .where('post.status = :status AND post.id = :postId OR post.name = :name', {
    //     status: 'publish',
    //     postId,
    //     name,
    //   }).getOne();

    // if (!post) {
    //   throw new HttpException('指定内容' + name + '不存在', 401);
    // }
    return post;
  }

  /**
   * 按分类法中的类别项查找
   */
  // async findAllByCateory(category: string, take: number): Promise<Post[]> {
  // const where = {
  //
  // }
  // }
  // const consumingProducts = await this.connection
  //   .getRepository(Product)
  //   .createQueryBuilder('product')
  //   .leftJoinAndSelect('product.facetValues', 'facetValues')
  //   .where('facetValues.id IN (:...facetValueIds)', { facetValueIds })
  //   .getMany();
  //
  // const consumingVariants = await this.connection
  //   .getRepository(ProductVariant)
  //   .createQueryBuilder('variant')
  //   .leftJoinAndSelect('variant.facetValues', 'facetValues')
  //   .where('facetValues.id IN (:...facetValueIds)', { facetValueIds })
  //   .getMany();
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

  async findAllByType(postType: any, userId: number, take: number): Promise<Post[]> {
    // const orderBy = order ? [order.orderBy, order.direction] : ['menu_order', 'ASC'];
    // var userInfo: {[index:string]: string} = {}
    const where: { [key: string]: any } = {
      status: 'publish',
      type: In([postType]),
    };
    if (userId) {
      where.author = userId;
    }
    // userRepository.find({
    //   select: ["firstName", "lastName"],
    //   relations: ["profile", "photos", "videos"],
    //   where: {
    //     firstName: "Timber",
    //     lastName: "Saw"
    //   },
    //   order: {
    //     name: "ASC",
    //     id: "DESC"
    //   },
    //   skip: 5,
    //   take: 10,
    //   cache: true
    // });
    return await this.postRepository.find({
        where,
        take: take || 10,
        skip: 0,
        cache: true,
      },
    );
    // return await this.postRepository.createQueryBuilder('post').take(limit).getMany();
  }

  async createPost(post): Promise<Post> {
    return await this.postRepository.save(post);
  }
}
