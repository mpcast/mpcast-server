import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { isProdMode, isDevMode } from '@app/app.environment';
import * as appConfig from '@app/app.config';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { ValidationPipe } from './pipes/validation.pipe';
import { HttpExceptionFilter } from '@app/filters/error.filter';
import { ErrorInterceptor } from '@app/interceptors/error.interceptor';
import { TransformInterceptor } from '@app/interceptors/transform.interceptor';
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor';

// 替换 console 为更统一友好的
const { log, warn, info } = console;
const color = c => isDevMode ? c : '';
global.console = Object.assign(console, {
  log: (...args) => log('[log]', ...args),
  warn: (...args) => warn(color('\x1b[33m%s\x1b[0m'), '[warn]', '[picker]', ...args),
  info: (...args) => info(color('\x1b[34m%s\x1b[0m'), '[info]', '[picker]', ...args),
  error: (...args) => info(color('\x1b[31m%s\x1b[0m'), '[error]', '[picker]', ...args),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, isProdMode ? { logger: false } : null);
  // app.use()
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ limit: '1mb' }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new TransformInterceptor(new Reflector()),
    new ErrorInterceptor(new Reflector()),
    new LoggingInterceptor(),
  );
  const options = new DocumentBuilder()
    .setTitle('播客系统服务端')
    .setDescription('The Podcast API')
    .setVersion('2.0')
    .addTag('Podcast Server')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  return await app.listen(appConfig.APP.PORT);
}

bootstrap().then(_ => {
  console.info(`Picker Run! port at ${appConfig.APP.PORT}, env: ${appConfig.APP.ENVIRONMENT}`);
});
