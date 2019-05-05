"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_logger_1 = require("./logger/default-logger");
const typeorm_logger_1 = require("./logger/typeorm-logger");
exports.defaultConfig = {
    hostname: '',
    port: 5000,
    dbConnectionOptions: {
        type: 'mysql',
        logger: new typeorm_logger_1.TypeOrmLogger(),
    },
    logger: new default_logger_1.DefaultLogger(),
    middleware: [],
    plugins: [],
    authOptions: {
        jwtTokenSecret: 'caixie-podcast', tokenMethod: 'bearer', expiresIn: 3600,
    },
    cors: {
        origin: true,
        credentials: true,
    },
};
//# sourceMappingURL=default-config.js.map