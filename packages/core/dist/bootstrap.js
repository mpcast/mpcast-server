"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const bodyParser = __importStar(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const config_helpers_1 = require("./config/config-helpers");
const mpcast_logger_1 = require("./config/logger/mpcast-logger");
const error_filter_1 = require("./filters/error.filter");
const error_interceptor_1 = require("./interceptors/error.interceptor");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
const validation_pipe_1 = require("./pipes/validation.pipe");
async function bootstrap(userConfig) {
    const config = await preBootstrapConfig(userConfig);
    mpcast_logger_1.Logger.info(`Bootstrapping Podcast Server...`);
    const appModule = await Promise.resolve().then(() => __importStar(require('./app.module')));
    let app;
    app = await core_1.NestFactory.create(appModule.AppModule, {
        cors: config.cors,
        logger: new mpcast_logger_1.Logger(),
    });
    app.use(helmet_1.default());
    app.use(compression_1.default());
    app.use(bodyParser.json({ limit: '1mb' }));
    app.useGlobalFilters(new error_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor(new core_1.Reflector()), new error_interceptor_1.ErrorInterceptor(new core_1.Reflector()), new logging_interceptor_1.LoggingInterceptor());
    await app.listen(config.port, config.hostname);
    logWelcomeMessage(config);
    return app;
}
exports.bootstrap = bootstrap;
async function preBootstrapConfig(userConfig) {
    if (userConfig) {
        config_helpers_1.setConfig(userConfig);
    }
    const entities = await getAllEntities(userConfig);
    const { coreSubscribersMap } = await Promise.resolve().then(() => __importStar(require('./entity/subscribers')));
    config_helpers_1.setConfig({
        dbConnectionOptions: {
            entities: [entities],
        },
    });
    const config = config_helpers_1.getConfig();
    mpcast_logger_1.Logger.useLogger(config.logger);
    return config;
}
exports.preBootstrapConfig = preBootstrapConfig;
async function getAllEntities(userConfig) {
    const { coreEntitiesMap } = await Promise.resolve().then(() => __importStar(require('./entity/entities')));
    const coreEntities = Object.values(coreEntitiesMap);
    console.log(coreEntities);
    return [...coreEntities];
}
function logWelcomeMessage(config) {
    console.log('welcome...');
    let version;
    try {
        version = require('../pacakge.json').version;
    }
    catch (e) {
        version = ' unknown';
    }
    mpcast_logger_1.Logger.info(`=================================================`);
    mpcast_logger_1.Logger.info(`Mpcast server (v${version}) now running on port ${config.port}`);
    mpcast_logger_1.Logger.info(`=================================================`);
}
//# sourceMappingURL=bootstrap.js.map