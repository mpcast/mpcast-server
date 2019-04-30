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

import { Controller, Get } from '@nestjs/common';
import * as APP_CONFIG from 'app.config';
import * as CACHE_KEY from 'common/constants/cache.constant';
import { HttpCache } from 'decorators/cache.decorator';

@Controller()
export class AppController {

  @Get()
  @HttpCache(CACHE_KEY.INFO, 60 * 60)
  root(): any {
    return APP_CONFIG.INFO;
  }
}
