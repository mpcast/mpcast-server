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
const redisStore = __importStar(require("cache-manager-redis-store"));
const APP_CONFIG = __importStar(require("../app.config"));
let CacheConfigService = class CacheConfigService {
    retryStrategy() {
        return {
            retry_strategy: (options) => {
                if (options.error && options.error.code === 'ECONNREFUSED') {
                    console.warn('Redis 连接出了问题：', options.error);
                    return new Error('Redis 服务器拒绝连接');
                }
                if (options.total_retry_time > 1000 * 60) {
                    return new Error('重试时间已用完');
                }
                if (options.attempt > 6) {
                    return new Error('尝试次数已达极限');
                }
                return Math.min(options.attempt * 100, 3000);
            },
        };
    }
    createCacheOptions() {
        return Object.assign({ store: redisStore }, APP_CONFIG.REDIS);
    }
};
CacheConfigService = __decorate([
    common_1.Injectable()
], CacheConfigService);
exports.CacheConfigService = CacheConfigService;
//# sourceMappingURL=cache.service.config.js.map