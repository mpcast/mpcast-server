import { ConfigService } from './config/config.service';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
export declare class AppModule implements NestModule {
    private configService;
    constructor(configService: ConfigService);
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void;
}
