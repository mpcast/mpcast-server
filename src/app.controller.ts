// import {Body, Controller, Get, Post, ValidationPipe} from '@nestjs/common';
// import {AppService} from './app.service';
//
// @Controller()
// export class AppController {
//     constructor(private readonly appService: AppService) {
//     }
//
//     @Get()
//     getHello(): string {
//         return this.appService.getHello();
//     }
// }

/**
 * App controller.
 * @file 主页控制器
 * @module app/controller
 */

import * as APP_CONFIG from '@app/app.config';
import * as CACHE_KEY from '@app/constants/cache.constant';
import { Get, Controller } from '@nestjs/common';
import { HttpCache } from '@app/decorators/cache.decorator';

@Controller()
export class AppController {

  @Get()
  @HttpCache(CACHE_KEY.INFO, 60 * 60)
  root(): any {
    return APP_CONFIG.INFO;
  }
}
