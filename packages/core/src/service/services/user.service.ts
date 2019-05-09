import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { ID } from '../../common/shared-types';
import { User } from '../../entity';
import { UserDto } from '../../restApi/dtos/user.dto';
import { patchEntity } from '../helpers/utils/patch-entity';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {
  }

  public create(newUser: UserDto): Promise<User> {
    return this.connection.getRepository(User).save(newUser).then(user => {
      return user;
    });
  }

  async createOrUpdate(input: Partial<User>): Promise<User> {
    let user: User;
    const existing = await this.connection.getRepository(User).findOne({
      where: {
        identifier: input.identifier,
      },
    });
    if (existing) {
      user = patchEntity(existing, input);
      // user = new Users(input);
    } else {
      user = new User(input);
    }

    return this.connection.getRepository(User).save(user);
  }

// 创建几个相片
//   let photo = new Photo();
//   photo.name = "Me and Bears";
//   photo.description = "I am near polar bears";
//   photo.filename = "photo-with-bears.jpg";
//   photo.albums = [album1, album2];
//   await connection.manager.save(photo);
  async updateUser(user: User): Promise<User> {
    return await this.connection.getRepository(User).save(user);
    // this.connection.getRepository(UserMeta).save()
  }

  public getDetailById(id: number): Promise<User | undefined> {
    return this.connection.getRepository(User).findOne({
      relations: ['metas'],
      where: {
        id,
      },
    });
  }

  /**
   * 根据 ids 批量返回数据
   * @param ids
   */
  getUsersDetailByIds(ids: ID[]) {
    return this.connection.getRepository(User).findByIds(ids);
  }

  /**
   * 按用户唯一标识查询用户是否存在
   * @param identifier
   */
  findByIdentifier(identifier: string): Promise<User | undefined> {
    return this.connection.getRepository(User).findOne({
      relations: ['metas'],
      where: {
        identifier,
      },
    });
  }
}
