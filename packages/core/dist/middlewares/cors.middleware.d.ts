import { NestMiddleware } from '@nestjs/common';
export declare class CorsMiddleware implements NestMiddleware {
    use(request: any, response: any, next: any): any;
}
