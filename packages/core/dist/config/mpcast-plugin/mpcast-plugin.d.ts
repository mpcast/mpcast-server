import { Provider } from '@nestjs/common';
import { Type } from '../../common/shared-types';
import { MpcastConfig } from '../mpcast-config';
export declare type InjectorFn = <T>(type: Type<T>) => T;
export interface APIExtensionDefinition {
    resolvers: Array<Type<any>>;
}
export interface MpcastPlugin {
    configure?(config: Required<MpcastConfig>): Required<MpcastConfig> | Promise<Required<MpcastConfig>>;
    onBootstrap?(inject: InjectorFn): void | Promise<void>;
    onClose?(): void | Promise<void>;
    extendShopAPI?(): APIExtensionDefinition;
    extendAdminAPI?(): APIExtensionDefinition;
    defineProviders?(): Provider[];
    defineEntities?(): Array<Type<any>>;
}
