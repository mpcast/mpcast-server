"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const schedule = __importStar(require("node-schedule"));
let CacheService = class CacheService {
    constructor(cache) {
        this.cache = cache;
    }
    get checkCacheServiceAvailable() {
        const client = this.cache.store.getClient();
        return client.connected && client.ready;
    }
    get(key) {
        if (!this.checkCacheServiceAvailable) {
            return Promise.reject('缓存客户端没准备好');
        }
        return this.cache.get(key);
    }
    set(key, value, options) {
        if (!this.checkCacheServiceAvailable) {
            return Promise.reject('缓存客户端没准备好');
        }
        return this.cache.set(key, value, options);
    }
    promise(options) {
        const { key, promise, ioMode = false } = options;
        const promiseTask = (resolve, reject) => {
            return promise().then((data) => {
                this.set(key, data);
                resolve(data);
            }).catch(reject);
        };
        const handlePromiseMode = () => {
            return new Promise((resolve, reject) => {
                this.get(key).then(value => {
                    const isValidValue = value !== null && value !== undefined;
                    isValidValue ? resolve(value) : promiseTask(resolve, reject);
                }).catch(reject);
            });
        };
        const handleIoMode = () => ({
            get: handlePromiseMode,
            update: () => new Promise(promiseTask),
        });
        return ioMode ? handleIoMode() : handlePromiseMode();
    }
    interval(options) {
        const { key, promise, timeout, timing, ioMode = false } = options;
        const promiseTask = () => {
            return promise().then((data) => {
                this.set(key, data);
                return Promise.resolve(data);
            });
        };
        if (timeout) {
            const doPromise = () => {
                promiseTask()
                    .then(_ => {
                    setTimeout(doPromise, timeout.success);
                })
                    .catch(error => {
                    const time = timeout.error || timeout.success;
                    setTimeout(doPromise, time);
                    console.warn(`Redis 超时任务执行失败，${time}s 后重试：${error}`);
                });
            };
            doPromise();
        }
        if (timing) {
            const doPromise = () => {
                promiseTask()
                    .then(data => data)
                    .catch(error => {
                    console.warn(`Redis 定时任务执行失败，${timing.error}s 后重试：${error}`);
                    setTimeout(doPromise, timing.error);
                });
            };
            doPromise();
            schedule.scheduleJob(timing.schedule, doPromise);
        }
        const getKeyCache = () => this.get(key);
        const handleIoMode = () => ({
            get: getKeyCache,
            update: promiseTask,
        });
        return ioMode ? handleIoMode() : getKeyCache;
    }
};
CacheService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], CacheService);
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map