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
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config");
const config_helpers_1 = require("./config/config-helpers");
const error_filter_1 = require("./filters/error.filter");
const error_interceptor_1 = require("./interceptors/error.interceptor");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
const validation_pipe_1 = require("./pipes/validation.pipe");
async function bootstrap(userConfig) {
    const config = await preBootstrapConfig(userConfig);
    config_1.Logger.info(`Bootstrapping Podcast Server...`);
    const appModule = await Promise.resolve().then(() => __importStar(require('./app.module')));
    let app;
    app = await core_1.NestFactory.create(appModule.AppModule, {
        cors: config.cors,
        logger: new config_1.Logger(),
    });
    app.setGlobalPrefix('api');
    app.use(helmet_1.default());
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
    console.log(userConfig);
    config_helpers_1.setConfig({
        dbConnectionOptions: {
            entities,
            subscribers: Object.values(coreSubscribersMap),
        },
    });
    const config = config_helpers_1.getConfig();
    console.log(config);
    config_1.Logger.useLogger(config.logger);
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
    let version;
    try {
        version = require('../package.json').version;
        console.log(version);
    }
    catch (e) {
        console.log(e);
        version = ' unknown';
    }
    config_1.Logger.info(`=================================================`);
    config_1.Logger.info(`Mpcast server (v${version}) now running on port ${config.port}`);
    config_1.Logger.info(`=================================================`);
}
//# sourceMappingURL=bootstrap.js.map