import { API_PORT } from '@mpcast/common/src/shared-constants';
import { MpcastConfig } from '@mpcast/core/src';
import * as path from 'path';
import { ConnectionOptions } from 'typeorm';

/**
 * 在开发过程中使用的配置设置
 */
export const devConfig: MpcastConfig = {
  authOptions: {
    jwtTokenSecret: 'Mpcast',
  },
  port: API_PORT,
  dbConnectionOptions: {
    synchronize: true,
    logging: false,
    ...getDbConfig(),
  },
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
        port: 3306,
        username: 'root',
        password: 'abcd1234',
        database: 'mpcast',
        dropSchema: true,
        // database: 'mpcast',
      };
  }
}
