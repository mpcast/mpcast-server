import { OptionService } from '../../../service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('options')
export class OptionController {

  constructor(
    private readonly optionService: OptionService,
  ) {
  }

  @Get(':type')
  async index(@Param('type') type) {
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
