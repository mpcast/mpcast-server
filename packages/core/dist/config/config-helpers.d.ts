import { DeepPartial } from '../common/shared-types';
import { ReadOnlyRequired } from '../common/types/common-types';
import { MpcastConfig } from './mpcast-config';
export declare function setConfig(userConfig: DeepPartial<MpcastConfig>): void;
export declare function getConfig(): ReadOnlyRequired<MpcastConfig>;
