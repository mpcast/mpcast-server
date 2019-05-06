import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigService } from './config/config.service';
export declare class AppModule implements NestModule {
    private configService;
    constructor(configService: ConfigService);
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void;
}
