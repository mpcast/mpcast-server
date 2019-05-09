import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { RequestHandler } from 'express';
import { ConnectionOptions } from 'typeorm';

import { MpcastLogger } from './logger/mpcast-logger';
import { MpcastPlugin } from './mpcast-plugin/mpcast-plugin';

export interface AuthOptions {
  /**
   * @default 'bearer
   */
  // tokenMethod?: 'cookie' | 'bearer';
  tokenMethod?: 'cookie' | 'bearer';

  /**
   * Token 密钥
   */
  jwtTokenSecret?: string;
  /**
   * @description
   * 设置 header 头属性
   *
   * @default `Authorization`
   */
  authTokenHeaderKey?: string;
  /**
   * @description
   * Sets the length of time that a verification token is valid for, after which the verification token must be refreshed.
   *
   * Expressed as a string describing a time span per
   * [zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`
   *
   * @default '3d'
   */
  expiresIn?: string | number;
}

export interface MpcastConfig {
  /**
   * @description
   * The connection options used by TypeORM to connect to the database.
   * 使用 TypeORM 的数据库连接项
   */
  dbConnectionOptions: ConnectionOptions;
  hostname?: string;
  /**
   * @description
   * Custom Express middleware for the server.
   *
   * @default []
   */
  middleware?: Array<{ handler: RequestHandler; route: string }>;
  /**
   * @description
   * An array of plugins.
   *
   * @default []
   */
  plugins?: MpcastPlugin[];

  /**
   * @description
   * 默认服务启动端口
   *
   * @default 5000
   */
  port?: number;

  /**
   * @description
   * Set the CORS handling for the server. See the [express CORS docs](https://github.com/expressjs/cors#configuration-options).
   *
   * @default { origin: true, credentials: true }
   */
  cors?: boolean | CorsOptions;
  /**
   * @description
   * Configuration for the handling of Assets.
   */
  // assetOptions?: AssetOptions;
  /**
   * @description
   * Configuration for authorization.
   */
  authOptions?: AuthOptions;
  /**
   * @description
   * Provide a logging service which implements the {@link MpcastLogger} interface.
   * 实现 BaseLogger 接口的一个默认日志服务
   * @default DefaultLogger
   */
  logger?: MpcastLogger;
}
