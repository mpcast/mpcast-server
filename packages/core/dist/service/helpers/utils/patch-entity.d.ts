import { BaseEntity } from '../../../entity/base.entity';
export declare type InputPatch<T> = {
    [K in keyof T]?: T[K] | null;
};
export declare function patchEntity<T extends BaseEntity, I extends InputPatch<T>>(entity: T, input: I): T;
