import { DeepPartial } from '../common/shared-types';
import { MpcastConfig } from './mpcast-config';
export declare function mergeConfig<T extends MpcastConfig>(target: T, source: DeepPartial<MpcastConfig>): T;
