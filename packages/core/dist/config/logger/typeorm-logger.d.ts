import { Logger as TypeOrmLoggerInterface, QueryRunner } from 'typeorm';
export declare class TypeOrmLogger implements TypeOrmLoggerInterface {
    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any;
    logMigration(message: string, queryRunner?: QueryRunner): any;
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    logSchemaBuild(message: string, queryRunner?: QueryRunner): any;
}
