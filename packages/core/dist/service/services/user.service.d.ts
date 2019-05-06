import { Connection, Repository } from 'typeorm';
import { UserDto } from '../../api/dtos/user.dto';
import { ID } from '../../common/shared-types';
import { UserEntity } from '../../entity';
export declare class UserService {
    private readonly connection;
    private readonly userRepository;
    constructor(connection: Connection, userRepository: Repository<UserEntity>);
    create(newUser: UserDto): Promise<UserEntity>;
    createOrUpdate(input: Partial<UserEntity>): Promise<UserEntity>;
    updateUser(user: UserEntity): Promise<UserEntity>;
    getDetailById(id: number): Promise<UserEntity | undefined>;
    getUsersDetailByIds(ids: ID[]): Promise<UserEntity[]>;
    findByIdentifier(identifier: string): Promise<UserEntity | undefined>;
}
