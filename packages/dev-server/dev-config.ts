import { API_PORT } from '@mpcast/common/src/shared-constants';
import * as path from 'path';
import { ConnectionOptions } from 'typeorm';

import { DefaultLogger, LogLevel, MpcastConfig } from '../core/dist';
// tslint:disabled

/**
 * 在开发过程中使用的配置设置
 */
export const devConfig: MpcastConfig = {
    authOptions: {
        tokenMethod: 'bearer',
        jwtTokenSecret: 'Mpcast',
    },
    port: API_PORT,
    dbConnectionOptions: {
        synchronize: true,
        logging: true,
        ...getDbConfig(),
    },
    logger: new DefaultLogger({ level: LogLevel.Info }),
};

function getDbConfig(): ConnectionOptions {
    const match = process.argv
        .filter(arg => arg.match(/--db=/))
        .map(arg => arg.replace(/^--db=/, ''));
    const dbType = match.length ? match[0] : 'mysql';
    switch (dbType) {
        case 'postgres':
            console.log('Using postgres connection');
            return {
                type: 'postgres',
                host: '127.0.0.1',
                port: 5432,
                username: 'postgres',
                password: 'abcd1234',
                database: 'mpcast',
            };
        case 'sqlite':
            console.log('Using sqlite connection');
            return {
                type: 'sqlite',
                database: path.join(__dirname, 'mpcast.sqlite'),
            };
        case'mysql':
        default:
            console.log('Using mysql connection');
            return {
                type: 'mysql',
                host: '127.0.0.1',
                port: 3399,
                username: 'root',
                password: 'abcd1234',
                database: 'podcast',
                // dropSchema: true,
                // database: 'mpcast',
            };
    }
}
