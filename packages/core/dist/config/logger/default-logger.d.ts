import { MpcastLogger, LogLevel } from './mpcast-logger';
export declare class DefaultLogger implements MpcastLogger {
    level: LogLevel;
    private readonly timestamp;
    private readonly localeStringOptions;
    private static originalLogLevel;
    constructor(options?: {
        level?: LogLevel;
        timestamp?: boolean;
    });
    static hideNestBoostrapLogs(): void;
    static restoreOriginalLogLevel(): void;
    error(message: string, context?: string, trace?: string | undefined): void;
    warn(message: string, context?: string): void;
    info(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    private logMessage;
    private logContext;
    private logTimestamp;
}
