/**
 * Helper module.
 * @file Helper 全局模块
 * @module processor/helper/module
 */

import { Global, HttpModule, Module } from '@nestjs/common';

import { IpService } from './helper.service.ip';

// const services = [AkismetService, BaiduSeoService, EmailService, IpService];

@Global()
@Module({
  imports: [HttpModule],
  providers: [IpService],
  exports: [IpService],
})
export class HelperModule {}
