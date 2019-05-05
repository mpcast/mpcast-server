import { OnModuleInit } from '@nestjs/common';
import { OptionService } from './services/option.service';
import { UserService } from './services/user.service';
export declare class ServiceModule implements OnModuleInit {
    private optionService;
    private userService;
    constructor(optionService: OptionService, userService: UserService);
    onModuleInit(): Promise<void>;
}
