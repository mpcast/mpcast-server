export interface ICacheManager {
    store: any;
    get(key: TCacheKey): any;
    set(key: TCacheKey, value: string, options?: {
        ttl: number;
    }): any;
}
export declare type TCacheKey = string;
export declare type TCacheResult<T> = Promise<T>;
export interface ICacheIoResult<T> {
    get(): TCacheResult<T>;
    update(): TCacheResult<T>;
}
export interface ICachePromiseOption<T> {
    key: TCacheKey;
    promise(): TCacheResult<T>;
}
export interface ICachePromiseIoOption<T> extends ICachePromiseOption<T> {
    ioMode?: boolean;
}
export interface ICacheIntervalTimeoutOption {
    error?: number;
    success?: number;
}
export interface ICacheIntervalTimingOption {
    error: number;
    schedule: any;
}
export interface ICacheIntervalOption<T> {
    key: TCacheKey;
    promise(): TCacheResult<T>;
    timeout?: ICacheIntervalTimeoutOption;
    timing?: ICacheIntervalTimingOption;
}
export declare type TCacheIntervalResult<T> = () => TCacheResult<T>;
export interface ICacheIntervalIOOption<T> extends ICacheIntervalOption<T> {
    ioMode?: boolean;
}
export declare class CacheService {
    private cache;
    constructor(cache: ICacheManager);
    private readonly checkCacheServiceAvailable;
    get<T>(key: TCacheKey): TCacheResult<T>;
    set<T>(key: TCacheKey, value: any, options?: {
        ttl: number;
    }): TCacheResult<T>;
    promise<T>(options: ICachePromiseOption<T>): TCacheResult<T>;
    promise<T>(options: ICachePromiseIoOption<T>): ICacheIoResult<T>;
    interval<T>(options: ICacheIntervalOption<T>): TCacheIntervalResult<T>;
    interval<T>(options: ICacheIntervalIOOption<T>): ICacheIoResult<T>;
}
