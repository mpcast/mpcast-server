import { User } from '../../../entity';
import { UserService } from '../../../service';
import { UserDto } from '../../dtos/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(userInput: UserDto): Promise<User>;
    oneself(request: any): Promise<User | null>;
    findOne(id: number): Promise<User | undefined>;
}
