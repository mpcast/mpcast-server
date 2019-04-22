import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@app/entity';
import { Repository, In } from 'typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@app/entity';

// import { annotateWithChildrenErrors } from 'graphql-tools/dist/stitching/errors';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {
  }

  async getNews(take: number) {
    // const where: {
    // }
    // return await this.postRepository.find({
    //     where,
    //     take: take || 10,
    //     skip: 0,
    //     cache: true,
    //   },
    // );
  }

  async findOne(postId: number, name: string): Promise<Post> {
    const post: Post | undefined = await this.postRepository.createQueryBuilder('post')
      .where('post.status = :status AND post.id = :postId OR post.name = :name', {
        status: 'publish',
        postId,
        name,
      }).getOne();

    // if (!post) {
    //   throw new HttpException('指定内容' + name + '不存在', 401);
    // }
    return post;
  }

  async findAll(postType: any, userId: number, take: number): Promise<Post[]> {
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
