import { OnModuleInit } from '@nestjs/common';
import { OptionService } from './services/option.service';
export declare class ServiceModule implements OnModuleInit {
    private optionService;
    constructor(optionService: OptionService);
    onModuleInit(): Promise<void>;
}
