"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_helpers_1 = require("./config-helpers");
class ConfigService {
    constructor() {
        this.activeConfig = config_helpers_1.getConfig();
    }
    get dbConnectionOptions() {
        return this.activeConfig.dbConnectionOptions;
    }
    get hostname() {
        return this.activeConfig.hostname;
    }
    get logger() {
        return this.activeConfig.logger;
    }
    get middleware() {
        return this.activeConfig.middleware;
    }
    get plugins() {
        return this.activeConfig.plugins;
    }
    get port() {
        return this.activeConfig.port;
    }
    get authOptions() {
        return this.activeConfig.authOptions;
    }
    get cors() {
        return this.activeConfig.cors;
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map