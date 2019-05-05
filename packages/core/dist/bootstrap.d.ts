import { INestApplication } from '@nestjs/common';
import { ReadOnlyRequired } from './common/types/common-types';
import { MpcastConfig } from './config/mpcast-config';
export declare type BootstrapFunction = (config: MpcastConfig) => Promise<INestApplication>;
export declare function bootstrap(userConfig: Partial<MpcastConfig>): Promise<INestApplication>;
export declare function preBootstrapConfig(userConfig: Partial<MpcastConfig>): Promise<ReadOnlyRequired<MpcastConfig>>;
