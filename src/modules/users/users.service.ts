import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { UserMeta, Users } from '@app/entity';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import {CreateUserInput} from '@app/modules/users/user.interface';
import { CreateUserDto } from '@app/modules/users/user.dto';
import { patchEntity } from '@app/service/helpers/utils/patch-entity';
import { ID } from '@app/common/shared-types';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
  ) {
  }

  public create(newUser: CreateUserDto): Promise<Users> {
    return this.usersRepository.save(newUser).then(user => {
      return user;
    });
  }

  async createOrUpdate(input: Partial<CreateUserDto>): Promise<Users> {
    let user: Users;
    const existing = await this.usersRepository.findOne({
      where: {
        identifier: input.identifier,
      },
    });
    if (existing) {
      user = patchEntity(existing, input);
      // user = new Users(input);
    } else {
      user = new Users(input);
    }

    return this.usersRepository.save(user);
  }
  // public update(user: Users): Promise<Users> {
    // return this.usersRepository.save(newUser).then(user => {
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
  async updateUser(user: Users): Promise<Users> {
    return await this.usersRepository.save(user);
    // this.connection.getRepository(UserMeta).save()
  }
  public getDetailById(id: number): Promise<Users> {
    return this.usersRepository.findOne({
      relations: ['metas'],
      where: {
        id,
      },
    });
  }

  findByIdentifier(identifier: string): Promise<Users> {
    return this.usersRepository.findOne({
      relations: ['metas'],
      where: {
        identifier,
      },
    });
  }
}
