import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { UserEntity } from '@app/entity';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import {CreateUserInput} from '@app/modules/users/user.interface';
import { CreateUserDto } from '@app/modules/users/user.dto';
import { patchEntity } from '@app/service/helpers/utils/patch-entity';
import { ID } from '@app/common/shared-types';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  public create(newUser: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.save(newUser).then(user => {
      return user;
    });
  }

  async createOrUpdate(input: Partial<CreateUserDto>): Promise<UserEntity> {
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

  // public update(user: Users): Promise<Users> {
  // return this.userRepository.save(newUser).then(user => {
  //   return user;
  // });
  // }

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

  public getDetailById(id: number): Promise<UserEntity> {
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

  findByIdentifier(identifier: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      relations: ['metas'],
      where: {
        identifier,
      },
    });
  }
}
