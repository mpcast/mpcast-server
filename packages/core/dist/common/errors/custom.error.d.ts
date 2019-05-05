import { HttpException, HttpStatus } from '@nestjs/common';
import { TExceptionOption } from '../types/interfaces/http.interface';
export declare class CustomError extends HttpException {
    constructor(options: TExceptionOption, statusCode?: HttpStatus);
}
