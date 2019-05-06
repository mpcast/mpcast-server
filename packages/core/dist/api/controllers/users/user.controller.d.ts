import { UserEntity } from '../../../entity';
import { UserService } from '../../../service';
import { UserDto } from '../../dtos/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(userInput: UserDto): Promise<UserEntity>;
    oneself(request: any): Promise<UserEntity | null>;
    findOne(id: number): Promise<UserEntity | undefined>;
}
