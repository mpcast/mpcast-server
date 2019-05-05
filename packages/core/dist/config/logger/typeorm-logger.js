"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mpcast_logger_1 = require("./mpcast-logger");
const context = 'TypeORM';
class TypeOrmLogger {
    log(level, message, queryRunner) {
        switch (level) {
            case 'info':
                mpcast_logger_1.Logger.info(message, context);
                break;
            case 'log':
                mpcast_logger_1.Logger.verbose(message, context);
                break;
            case 'warn':
                mpcast_logger_1.Logger.warn(message, context);
                break;
        }
    }
    logMigration(message, queryRunner) {
        mpcast_logger_1.Logger.info(message, context);
    }
    logQuery(query, parameters, queryRunner) {
        mpcast_logger_1.Logger.debug(`Query: "${query}" -- [${parameters}]`, context);
    }
    logQueryError(error, query, parameters, queryRunner) {
        mpcast_logger_1.Logger.error(`Query error: ${error}, "${query}" -- [${parameters}]`, context);
    }
    logQuerySlow(time, query, parameters, queryRunner) {
        mpcast_logger_1.Logger.warn(`Slow query (${time}): "${query}" -- [${parameters}]`, context);
    }
    logSchemaBuild(message, queryRunner) {
        mpcast_logger_1.Logger.info(message, context);
    }
}
exports.TypeOrmLogger = TypeOrmLogger;
//# sourceMappingURL=typeorm-logger.js.map