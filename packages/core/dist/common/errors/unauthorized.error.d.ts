import { TMessage } from '../types/interfaces/http.interface';
import { UnauthorizedException } from '@nestjs/common';
export declare class HttpUnauthorizedError extends UnauthorizedException {
    constructor(message?: TMessage, error?: any);
}
