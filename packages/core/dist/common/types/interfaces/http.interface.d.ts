export declare enum EHttpStatus {
    Error = "error",
    Success = "success"
}
export declare type TMessage = string;
export declare type TExceptionOption = TMessage | {
    message: TMessage;
    error?: any;
};
export interface IHttpResultPaginate<T> {
    data: T;
    params: any;
    pagination: {
        total: number;
        current_page: number;
        total_page: number;
        per_page: number;
    };
}
export interface IHttpResponseBase {
    status: EHttpStatus;
    message: TMessage;
}
export declare type THttpErrorResponse = IHttpResponseBase & {
    error: any;
    debug?: string;
};
export declare type THttpSuccessResponse<T> = IHttpResponseBase & {
    result: T | IHttpResultPaginate<T>;
};
export declare type THttpResponse<T> = THttpErrorResponse | THttpSuccessResponse<T>;
