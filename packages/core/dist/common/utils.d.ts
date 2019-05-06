export declare function not(predicate: (...args: any[]) => boolean): (...args: any[]) => boolean;
export declare function foundIn<T>(set: T[], compareBy: keyof T): (item: T) => boolean;
export declare function assertFound<T>(promise: Promise<T | undefined>): Promise<T>;
export declare function normalizeEmailAddress(input: string): string;
export interface IFilterConfig {
    filterKey?: any;
    cleanMeta?: boolean;
}
export declare function formatAllMeta(list: any, config?: IFilterConfig): any;
export declare function formatOneMeta(item: any, config?: IFilterConfig): any;
