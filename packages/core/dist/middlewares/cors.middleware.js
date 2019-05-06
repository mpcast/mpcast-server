"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const APP_CONFIG = __importStar(require("../app.config"));
const app_environment_1 = require("../app.environment");
let CorsMiddleware = class CorsMiddleware {
    use(request, response, next) {
        const getMethod = (method) => common_1.RequestMethod[method];
        const origin = request.headers.origin || '';
        const allowedOrigins = [...APP_CONFIG.CROSS_DOMAIN.allowedOrigins];
        const allowedMethods = [common_1.RequestMethod.GET, common_1.RequestMethod.HEAD, common_1.RequestMethod.PUT, common_1.RequestMethod.PATCH, common_1.RequestMethod.POST, common_1.RequestMethod.DELETE];
        const allowedHeaders = ['Authorization', 'Origin', 'No-Cache', 'X-Requested-With', 'If-Modified-Since', 'Pragma',
            'Last-Modified', 'Cache-Control', 'Expires', 'Content-Type', 'X-E4M-With'];
        if (!origin || allowedOrigins.includes(origin) || app_environment_1.isDevMode) {
            response.setHeader('Access-Control-Allow-Origin', origin || '*');
        }
        response.header('Access-Control-Allow-Headers', allowedHeaders.join(','));
        response.header('Access-Control-Allow-Methods', allowedMethods.map(getMethod).join(','));
        response.header('Access-Control-Max-Age', '1728000');
        response.header('Content-Type', 'application/json; charset=utf-8');
        response.header('X-Powered-By', `Picker ${APP_CONFIG.INFO.version}`);
        if (request.method === getMethod(common_1.RequestMethod.OPTIONS)) {
            return response.sendStatus(common_1.HttpStatus.NO_CONTENT);
        }
        else {
            return next();
        }
    }
};
CorsMiddleware = __decorate([
    common_1.Injectable()
], CorsMiddleware);
exports.CorsMiddleware = CorsMiddleware;
//# sourceMappingURL=cors.middleware.js.map