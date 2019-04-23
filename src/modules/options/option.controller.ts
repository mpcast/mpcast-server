import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OptionService } from '@app/modules/options/option.service';

@Controller('option')
export class OptionController {

  constructor(
    private readonly optionService: OptionService,
  ) {
  }

}
