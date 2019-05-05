import { NestMiddleware } from '@nestjs/common';
export declare class OriginMiddleware implements NestMiddleware {
    use(request: any, response: any, next: any): any;
}
