import { ReadOnlyRequired } from '../common/types/common-types';

import { MpcastConfig } from './mpcast-config';
import { DefaultLogger } from './logger/default-logger';
import { TypeOrmLogger } from './logger/typeorm-logger';

export const defaultConfig: ReadOnlyRequired<MpcastConfig> = {
  hostname: '',
  port: 5000,
  dbConnectionOptions: {
    type: 'mysql',
    logger: new TypeOrmLogger(),
  },
  logger: new DefaultLogger(),
  middleware: [],
  plugins: [],
  authOptions: {
    jwtTokenSecret: 'caixie-podcast', tokenMethod: 'bearer', expiresIn: 3600,
  },
  cors: {
    origin: true,
    credentials: true,
  },
};
