export declare type DeepPartial<T> = {
    [P in keyof T]?: null | (T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : DeepPartial<T[P]>);
};
export declare type Type<T> = new (...args: any[]) => T;
export interface PaginatedList<T> {
    items: T[];
    totalItems: number;
}
export declare type ID = string | number;
export declare type CustomFieldType = 'string' | 'localeString' | 'int' | 'float' | 'boolean' | 'datetime';
export interface CustomFieldConfig {
    name: string;
    type: CustomFieldType;
}
export interface CustomFields {
    Address?: CustomFieldConfig[];
    Collection?: CustomFieldConfig[];
    Customer?: CustomFieldConfig[];
    Facet?: CustomFieldConfig[];
    FacetValue?: CustomFieldConfig[];
    GlobalSettings?: CustomFieldConfig[];
    Product?: CustomFieldConfig[];
    ProductOption?: CustomFieldConfig[];
    ProductOptionGroup?: CustomFieldConfig[];
    ProductVariant?: CustomFieldConfig[];
    User?: CustomFieldConfig[];
}
export interface HasCustomFields {
    customFields: CustomFieldsObject;
}
export declare type MayHaveCustomFields = Partial<HasCustomFields>;
export interface CustomFieldsObject {
    [key: string]: any;
}
export interface AdminUiConfig {
    apiHost: string | 'auto';
    apiPort: number | 'auto';
    adminApiPath: string;
}
