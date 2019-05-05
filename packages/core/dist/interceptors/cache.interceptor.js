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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const APP_CONFIG = __importStar(require("../app.config"));
const META = __importStar(require("../common/constants/meta.constant"));
let HttpCacheInterceptor = class HttpCacheInterceptor extends common_1.CacheInterceptor {
    async intercept(context, next) {
        const key = this.trackBy(context);
        const target = context.getHandler();
        const metaTTL = this.reflector.get(META.HTTP_CACHE_TTL_METADATA, target);
        const ttl = metaTTL || APP_CONFIG.REDIS.defaultCacheTTL;
        if (!key) {
            return next.handle();
        }
        try {
            const value = await this.cacheManager.get(key);
            return value ? rxjs_1.of(value) : next.handle().pipe(operators_1.tap(response => this.cacheManager.set(key, response, { ttl })));
        }
        catch (error) {
            return next.handle();
        }
    }
    trackBy(context) {
        const request = context.switchToHttp().getRequest();
        const httpServer = this.httpAdapterHost.httpAdapter;
        const isHttpApp = httpServer && !!httpServer.getRequestMethod;
        const isGetRequest = isHttpApp && httpServer.getRequestMethod(request) === common_1.RequestMethod[common_1.RequestMethod.GET];
        const requestUrl = httpServer.getRequestUrl(request);
        const cacheKey = this.reflector.get(META.HTTP_CACHE_KEY_METADATA, context.getHandler());
        const isMatchedCache = isHttpApp && isGetRequest && cacheKey;
        return isMatchedCache ? cacheKey : undefined;
    }
};
HttpCacheInterceptor = __decorate([
    common_1.Injectable()
], HttpCacheInterceptor);
exports.HttpCacheInterceptor = HttpCacheInterceptor;
//# sourceMappingURL=cache.interceptor.js.map