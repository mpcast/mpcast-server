"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Error"] = 0] = "Error";
    LogLevel[LogLevel["Warn"] = 1] = "Warn";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Verbose"] = 3] = "Verbose";
    LogLevel[LogLevel["Debug"] = 4] = "Debug";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
const noopLogger = {
    error() { },
    warn() { },
    info() { },
    verbose() { },
    debug() { },
};
class Logger {
    static get logger() {
        return this._logger || noopLogger;
    }
    get instance() {
        const { _instance } = Logger;
        return _instance;
    }
    static useLogger(logger) {
        Logger._logger = logger;
    }
    error(message, trace, context) {
        this.instance.error(message, context, trace);
    }
    warn(message, context) {
        this.instance.warn(message, context);
    }
    log(message, context) {
        this.instance.info(message, context);
    }
    verbose(message, context) {
        this.instance.verbose(message, context);
    }
    debug(message, context) {
        this.instance.debug(message, context);
    }
    static error(message, context, trace) {
        Logger.logger.error(message, context, trace);
    }
    static warn(message, context) {
        Logger.logger.warn(message, context);
    }
    static info(message, context) {
        Logger.logger.info(message, context);
    }
    static verbose(message, context) {
        Logger.logger.verbose(message, context);
    }
    static debug(message, context) {
        Logger.logger.debug(message, context);
    }
}
Logger._instance = Logger;
exports.Logger = Logger;
//# sourceMappingURL=mpcast-logger.js.map