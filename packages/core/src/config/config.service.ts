import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { RequestHandler } from 'express';
import { ConnectionOptions } from 'typeorm';

import { ReadOnlyRequired } from '../common/types/common-types';

import { AuthOptions, MpcastConfig } from './mpcast-config';
import { getConfig } from './config-helpers';
import { MpcastLogger } from './logger/mpcast-logger';
import { MpcastPlugin } from './mpcast-plugin/mpcast-plugin';

export class ConfigService implements MpcastConfig {
  private activeConfig: ReadOnlyRequired<MpcastConfig>;

  constructor() {
    this.activeConfig = getConfig();
  }

  get dbConnectionOptions(): ConnectionOptions {
    return this.activeConfig.dbConnectionOptions;
  }

  get hostname(): string {
    return this.activeConfig.hostname;
  }

  get logger(): MpcastLogger {
    return this.activeConfig.logger;
  }

  get middleware(): Array<{ handler: RequestHandler; route: string }> {
    return this.activeConfig.middleware;
  }

  get plugins(): MpcastPlugin[] {
    return this.activeConfig.plugins;
  }

  get port(): number {
    return this.activeConfig.port;
  }

  get authOptions(): AuthOptions {
    return this.activeConfig.authOptions;
  }

  get cors(): boolean | CorsOptions {
    return this.activeConfig.cors;
  }
}
