import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { UserDto } from '../../api/dtos/user.dto';
import { ID } from '../../common/shared-types';
import { UserEntity } from '../../entity';
import { patchEntity } from '../helpers/utils/patch-entity';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  public create(newUser: UserDto): Promise<UserEntity> {
    return this.userRepository.save(newUser).then(user => {
      return user;
    });
  }

  async createOrUpdate(input: Partial<UserEntity>): Promise<UserEntity> {
    let user: UserEntity;
    const existing = await this.userRepository.findOne({
      where: {
        identifier: input.identifier,
      },
    });
    if (existing) {
      user = patchEntity(existing, input);
      // user = new Users(input);
    } else {
      user = new UserEntity(input);
    }

    return this.userRepository.save(user);
  }

// 创建几个相片
//   let photo = new Photo();
//   photo.name = "Me and Bears";
//   photo.description = "I am near polar bears";
//   photo.filename = "photo-with-bears.jpg";
//   photo.albums = [album1, album2];
//   await connection.manager.save(photo);
  async updateUser(user: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(user);
    // this.connection.getRepository(UserMeta).save()
  }

  public getDetailById(id: number): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
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
    return this.userRepository.findByIds(ids);
  }

  /**
   * 按用户唯一标识查询用户是否存在
   * @param identifier
   */
  findByIdentifier(identifier: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      relations: ['metas'],
      where: {
        identifier,
      },
    });
  }
}
