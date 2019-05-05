import { LoggerService } from '@nestjs/common';
export declare enum LogLevel {
    Error = 0,
    Warn = 1,
    Info = 2,
    Verbose = 3,
    Debug = 4
}
export interface MpcastLogger {
    error(message: string, context?: string, trace?: string): void;
    warn(message: string, context?: string): void;
    info(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    debug(message: string, context?: string): void;
}
export declare class Logger implements LoggerService {
    private static _instance;
    private static _logger;
    static readonly logger: MpcastLogger;
    private readonly instance;
    static useLogger(logger: MpcastLogger): void;
    error(message: any, trace?: string, context?: string): any;
    warn(message: any, context?: string): any;
    log(message: any, context?: string): any;
    verbose(message: any, context?: string): any;
    debug(message: any, context?: string): any;
    static error(message: string, context?: string, trace?: string): void;
    static warn(message: string, context?: string): void;
    static info(message: string, context?: string): void;
    static verbose(message: string, context?: string): void;
    static debug(message: string, context?: string): void;
}
