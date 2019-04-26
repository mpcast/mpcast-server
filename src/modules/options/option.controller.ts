import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OptionService } from '@app/modules/options/option.service';

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
