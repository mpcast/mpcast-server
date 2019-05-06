import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
export declare class OriginMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: any): any;
}
