import { Types } from 'mongoose';
export declare enum EQueryParamsField {
    Page = "page",
    PerPage = "per_page",
    Sort = "sort",
    Date = "date",
    Keyword = "keyword",
    State = "state",
    Public = "public",
    Origin = "origin",
    ParamsId = "paramsId",
    CommentState = "commentState"
}
export interface IQueryParamsConfig {
    [key: string]: string | number | boolean | Types.ObjectId | Date | RegExp | IQueryParamsConfig;
}
export interface IQueryParamsResult {
    querys: IQueryParamsConfig;
    options: IQueryParamsConfig;
    params: IQueryParamsConfig;
    origin: IQueryParamsConfig;
    request: any;
    visitors: {
        ip: string;
        ua: string;
        referer: string;
    };
    isAuthenticated: boolean;
}
interface ITransformConfigObject {
    [key: string]: string | number | boolean;
}
export declare type TTransformConfig = EQueryParamsField | string | ITransformConfigObject;
export declare const QueryParams: (...dataOrPipes: any[]) => ParameterDecorator;
export {};
