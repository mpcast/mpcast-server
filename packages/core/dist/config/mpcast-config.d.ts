import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { RequestHandler } from 'express';
import { ConnectionOptions } from 'typeorm';
import { MpcastLogger } from './logger/mpcast-logger';
import { MpcastPlugin } from './mpcast-plugin/mpcast-plugin';
export interface AuthOptions {
    tokenMethod?: 'cookie' | 'bearer';
    jwtTokenSecret?: string;
    authTokenHeaderKey?: string;
    expiresIn?: string | number;
}
export interface MpcastConfig {
    dbConnectionOptions: ConnectionOptions;
    hostname?: string;
    middleware?: Array<{
        handler: RequestHandler;
        route: string;
    }>;
    plugins?: MpcastPlugin[];
    port?: number;
    cors?: boolean | CorsOptions;
    authOptions: AuthOptions;
    logger?: MpcastLogger;
}
