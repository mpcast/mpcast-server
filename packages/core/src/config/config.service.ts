import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { RequestHandler } from 'express';
import { ConnectionOptions } from 'typeorm';

import { ReadOnlyRequired } from '../common/types/common-types';

import { AuthOptions, BaseConfig } from './base-config';
import { getConfig } from './config-helpers';
import { BaseLogger } from './logger/base-logger';
import { PodcastPlugin } from './podcast-plugin';

export class ConfigService implements BaseConfig {
  private activeConfig: ReadOnlyRequired<BaseConfig>;

  constructor() {
    this.activeConfig = getConfig();
  }

  get dbConnectionOptions(): ConnectionOptions {
    return this.activeConfig.dbConnectionOptions;
  }

  get hostname(): string {
    return this.activeConfig.hostname;
  }

  get logger(): BaseLogger {
    return this.activeConfig.logger;
  }

  get middleware(): Array<{ handler: RequestHandler; route: string }> {
    return this.activeConfig.middleware;
  }

  get plugins(): PodcastPlugin[] {
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
