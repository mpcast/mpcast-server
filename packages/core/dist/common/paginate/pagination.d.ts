export declare class Pagination<PaginationObject> {
    readonly items: PaginationObject[];
    readonly itemCount: number;
    readonly totalItems: number;
    readonly pageCount: number;
    readonly next?: string | undefined;
    readonly previous?: string | undefined;
    constructor(items: PaginationObject[], itemCount: number, totalItems: number, pageCount: number, next?: string | undefined, previous?: string | undefined);
}
