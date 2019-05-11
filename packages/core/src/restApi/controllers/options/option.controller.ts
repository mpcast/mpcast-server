import { Controller, Get, Param } from '@nestjs/common';

import { Permission } from '../../../common/generated-types';
import { OptionService } from '../../../service';
import { Allow } from '../../decorators/allow.decorator';

@Controller('options')
export class OptionController {

    constructor(
        private readonly optionService: OptionService,
    ) {
    }

    @Get(':type')
    @Allow(Permission.Owner)
    async index(@Param('type') type: any) {
        console.log('get options ...');
        const allOption = await this.optionService.load();
        const foundOption = allOption[type];
        if (foundOption) {
            if (type === 'minapp') {
                Reflect.deleteProperty(foundOption, 'config');
            }
            return foundOption;
        }
    }

    @Get()
    all() {
        return this.optionService.load(true);
    }
}
