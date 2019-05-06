import { HttpStatus } from '@nestjs/common';
import { TMessage } from '../common/types/interfaces/http.interface';
interface IHandleOption {
    error?: HttpStatus;
    success?: HttpStatus;
    message: TMessage;
    usePaginate?: boolean;
}
declare type THandleOption = TMessage | IHandleOption;
export declare const error: (message: string, statusCode?: HttpStatus | undefined) => MethodDecorator;
export declare const success: (message: string, statusCode?: HttpStatus | undefined) => MethodDecorator;
export declare function handle(args: THandleOption): MethodDecorator;
export declare const paginate: () => MethodDecorator;
export declare const HttpProcessor: {
    error: (message: string, statusCode?: HttpStatus | undefined) => MethodDecorator;
    success: (message: string, statusCode?: HttpStatus | undefined) => MethodDecorator;
    handle: typeof handle;
    paginate: () => MethodDecorator;
};
export {};
