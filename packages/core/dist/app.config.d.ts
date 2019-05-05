export declare const APP: {
    LIMIT: number;
    PORT: number;
    ROOT_PATH: string;
    NAME: string;
    URL: string;
    ENVIRONMENT: string | undefined;
    FRONT_END_PATH: string;
};
export declare const CROSS_DOMAIN: {
    allowedOrigins: string[];
    allowedReferer: string;
};
export declare const REDIS: {
    host: unknown;
    port: unknown;
    ttl: null;
    defaultCacheTTL: number;
};
export declare const AUTH: {
    expiresIn: unknown;
    data: unknown;
    jwtTokenSecret: unknown;
    defaultPassword: unknown;
};
export declare const ALIYUN: {
    ip: unknown;
};
export declare const QINIU: {
    accessKey: unknown;
    secretKey: unknown;
    bucket: unknown;
    origin: unknown;
    uploadURL: unknown;
};
export declare const INFO: {
    name: any;
    version: any;
    author: any;
    site: string;
    github: string;
    homepage: any;
    powered: string[];
};
