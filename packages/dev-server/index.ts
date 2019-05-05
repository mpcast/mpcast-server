import { bootstrap } from '@mpcast/core/src';

import { devConfig } from './dev-config';

bootstrap(devConfig).catch((err: any) => {
  // tslint:disable-next-line
  console.log(err);
});
