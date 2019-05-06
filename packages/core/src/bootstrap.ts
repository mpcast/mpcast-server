import { INestApplication } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
// import { EntitySubscriberInterface } from 'typeorm';

import { Type } from './common/shared-types';
import { ReadOnlyRequired } from './common/types/common-types';
// import { DefaultLogger } from './config/logger/default-logger';
import { Logger, MpcastConfig } from './config';
import { getConfig, setConfig } from './config/config-helpers';
// import { EntitySchema } from 'typeorm';
import { BaseEntity } from './entity/base.entity';
import { HttpExceptionFilter } from './filters/error.filter';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ValidationPipe } from './pipes/validation.pipe';

export type BootstrapFunction = (config: MpcastConfig) => Promise<INestApplication>;

export async function bootstrap(userConfig: Partial<MpcastConfig>): Promise<INestApplication> {
  const config = await preBootstrapConfig(userConfig);
  Logger.info(`Bootstrapping Podcast Server...`);

  // AppModule 的启动必需在 entities 已经加载并配置之后
  // 以便在 AppModule decorator 中可以使用它们
  // tslint:disable-next-line:whitespace
  const appModule = await import('./app.module');
  // DefaultLogger.hideNestBoostrapLogs();
  let app: INestApplication;
  // app = await NestFactory.create(appModule.AppModule, isProdMode ? { logger: false } : null);
  app = await NestFactory.create(appModule.AppModule, {
    cors: config.cors,
    logger: new Logger(),
  });
  // DefaultLogger.restoreOriginalLogLevel();
  // app.useLogger(new Logger());
  app.use(helmet());
  // app.use(compression());
  app.use(bodyParser.json({ limit: '1mb' }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new TransformInterceptor(new Reflector()),
    new ErrorInterceptor(new Reflector()),
    new LoggingInterceptor(),
  );

  // const options = new DocumentBuilder()
  //   .setTitle('播客系统服务端 API')
  //   .setDescription('The Podcast API')
  //   .setVersion('2.0')
  //   .addTag('Podcast Server')
  //   .build();
  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('apidoc', app, document);

  // return await app.listen(appConfig.APP.PORT);
  await app.listen(config.port, config.hostname);
  logWelcomeMessage(config);
  return app;
}

/**
 * Setting the global config must be done prior to loading the AppModule.
 */
export async function preBootstrapConfig(
  userConfig: Partial<MpcastConfig>,
): Promise<ReadOnlyRequired<MpcastConfig>> {
  console.log('config ....');
  if (userConfig) {
    setConfig(userConfig);
  }

  // Entities *must* be loaded after the user config is set in order for the
  // base BaseEntity to be correctly configured with the primary key type
  // specified in the EntityIdStrategy.
  // tslint:disable-next-line:whitespace
  // const pluginEntities = getEntitiesFromPlugins(userConfig);
  const entities = await getAllEntities(userConfig);
  const { coreSubscribersMap } = await import('./entity/subscribers');
  /**
   * Entities to be loaded for this connection.
   * Accepts both entity classes and directories where from entities need to be loaded.
   * Directories support glob patterns.
   */
// readonly entities?: ((Function | string | EntitySchema<any>))[];
  /**
   * Subscribers to be loaded for this connection.
   * Accepts both subscriber classes and directories where from subscribers need to be loaded.
   * Directories support glob patterns.
   */
// readonly subscribers?: (Function | string)[];
//   setConfig({
//     dbConnectionOptions: {
//       entities,
//     },
//   });
  const config = getConfig();
  Logger.useLogger(config.logger);
  return config;
}

/**
 * Returns an array of core entities and any additional entities defined in plugins.
 */
async function getAllEntities(userConfig: Partial<MpcastConfig>): Promise<Array<Type<any>>> {
// readonly entities?: ((Function | string | EntitySchema<any>))[];
  const { coreEntitiesMap } = await import('./entity/entities');
  console.log(coreEntitiesMap);
  const coreEntities = Object.values(coreEntitiesMap) as Array<Type<BaseEntity>>;
  console.log(coreEntities);
  // TODO: 后面增加获取插件 Entity 处理k
  return [...coreEntities];
}

function logWelcomeMessage(config: MpcastConfig) {
  console.log('welcome...');
  let version: string;
  // Logger.info(`${label}: http://${config.hostname || 'localhost'}:${config.port}/${route}/ -> http://${hostname || 'localhost'}:${port}`);

  try {
    version = require('../pacakge.json').version;
  } catch (e) {
    version = ' unknown';
  }
  Logger.info(`=================================================`);
  Logger.info(`Mpcast server (v${version}) now running on port ${config.port}`);
  Logger.info(`=================================================`);
}
