import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { RequestHandler } from 'express';
import { ConnectionOptions } from 'typeorm';
import { AuthOptions, MpcastConfig } from './mpcast-config';
import { MpcastLogger } from './logger/mpcast-logger';
import { MpcastPlugin } from './mpcast-plugin/mpcast-plugin';
export declare class ConfigService implements MpcastConfig {
    private activeConfig;
    constructor();
    readonly dbConnectionOptions: ConnectionOptions;
    readonly hostname: string;
    readonly logger: MpcastLogger;
    readonly middleware: Array<{
        handler: RequestHandler;
        route: string;
    }>;
    readonly plugins: MpcastPlugin[];
    readonly port: number;
    readonly authOptions: AuthOptions;
    readonly cors: boolean | CorsOptions;
}
