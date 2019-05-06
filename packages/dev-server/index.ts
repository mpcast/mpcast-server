
import { bootstrap } from '../core/dist/bootstrap';

import { devConfig } from './dev-config';

bootstrap(devConfig).catch((err: any) => {
  // tslint:disable-next-line
  console.log(err);
});
