import { Logger as TypeOrmLoggerInterface, QueryRunner } from 'typeorm';

import { Logger } from './mpcast-logger';

const context = 'TypeORM';

/**
 * 使用 Base Logger 自定义 TypeORM 的日志记录
 */
export class TypeOrmLogger implements TypeOrmLoggerInterface {
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
    switch (level) {
      case 'info':
        Logger.info(message, context);
        break;
      case 'log':
        Logger.verbose(message, context);
        break;
      case 'warn':
        Logger.warn(message, context);
        break;
    }
  }

  logMigration(message: string, queryRunner?: QueryRunner): any {
    Logger.info(message, context);
  }

  /**
   * 查询语句
   * @param query
   * @param parameters
   * @param queryRunner
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    Logger.debug(`Query: "${query}" -- [${parameters}]`, context);
  }

  /**
   * 查询错误
   * @param error
   * @param query
   * @param parameters
   * @param queryRunner
   */
  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    Logger.error(`Query error: ${error}, "${query}" -- [${parameters}]`, context);
  }

  /**
   * 慢查询
   * @param time
   * @param query
   * @param parameters
   * @param queryRunner
   */
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    Logger.warn(`Slow query (${time}): "${query}" -- [${parameters}]`, context);
  }

  /**
   * Schema 构建
   * @param message
   * @param queryRunner
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    Logger.info(message, context);
  }
}
