"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const mpcast_logger_1 = require("./mpcast-logger");
const DEFAULT_CONTEXT = 'Podcast Server';
class DefaultLogger {
    constructor(options) {
        this.level = mpcast_logger_1.LogLevel.Info;
        this.localeStringOptions = {
            year: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'numeric',
        };
        this.level = options && options.level || mpcast_logger_1.LogLevel.Info;
        this.timestamp = options && options.timestamp !== undefined ? options.timestamp : true;
    }
    static hideNestBoostrapLogs() {
        const { logger } = mpcast_logger_1.Logger;
        if (logger instanceof DefaultLogger) {
            if (logger.level === mpcast_logger_1.LogLevel.Info) {
                this.originalLogLevel = mpcast_logger_1.LogLevel.Info;
                logger.level = mpcast_logger_1.LogLevel.Warn;
            }
        }
    }
    static restoreOriginalLogLevel() {
        const { logger } = mpcast_logger_1.Logger;
        if (logger instanceof DefaultLogger && DefaultLogger.originalLogLevel !== undefined) {
            logger.level = DefaultLogger.originalLogLevel;
        }
    }
    error(message, context, trace) {
        if (this.level >= mpcast_logger_1.LogLevel.Error) {
            this.logMessage(chalk_1.default.red(`error`), chalk_1.default.red(message + (trace ? ` trace: \n${trace}` : '')), context);
        }
    }
    warn(message, context) {
        if (this.level >= mpcast_logger_1.LogLevel.Warn) {
            this.logMessage(chalk_1.default.yellow(`warn`), chalk_1.default.yellow(message), context);
        }
    }
    info(message, context) {
        if (this.level >= mpcast_logger_1.LogLevel.Info) {
            this.logMessage(chalk_1.default.blue(`info`), message, context);
        }
    }
    verbose(message, context) {
        if (this.level >= mpcast_logger_1.LogLevel.Verbose) {
            this.logMessage(chalk_1.default.magenta(`verbose`), message, context);
        }
    }
    debug(message, context) {
        if (this.level >= mpcast_logger_1.LogLevel.Debug) {
            this.logMessage(chalk_1.default.magenta(`debug`), message, context);
        }
    }
    logMessage(prefix, message, context) {
        process.stdout.write([
            prefix,
            this.logTimestamp(),
            this.logContext(context),
            message,
            '\n',
        ].join(' '));
    }
    logContext(context) {
        return chalk_1.default.cyan(`[${context || DEFAULT_CONTEXT}]`);
    }
    logTimestamp() {
        if (this.timestamp) {
            const timestamp = new Date(Date.now()).toLocaleString(undefined, this.localeStringOptions);
            return chalk_1.default.gray(timestamp + ' -');
        }
        else {
            return '';
        }
    }
}
exports.DefaultLogger = DefaultLogger;
//# sourceMappingURL=default-logger.js.map