import { Connection } from 'typeorm';
import { UserDto } from '../../api/dtos/user.dto';
import { ID } from '../../common/shared-types';
import { User } from '../../entity';
export declare class UserService {
    private readonly connection;
    constructor(connection: Connection);
    create(newUser: UserDto): Promise<User>;
    createOrUpdate(input: Partial<User>): Promise<User>;
    updateUser(user: User): Promise<User>;
    getDetailById(id: number): Promise<User | undefined>;
    getUsersDetailByIds(ids: ID[]): Promise<User[]>;
    findByIdentifier(identifier: string): Promise<User | undefined>;
}
