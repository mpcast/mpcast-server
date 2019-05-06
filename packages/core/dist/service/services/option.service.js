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
const typeorm_1 = require("@nestjs/typeorm");
const _ = __importStar(require("lodash"));
const typeorm_2 = require("typeorm");
const cache_service_1 = require("../../cache/cache.service");
const CACHE_KEY = __importStar(require("../../common/constants/cache.constant"));
const entity_1 = require("../../entity");
let OptionService = class OptionService {
    constructor(connection, cacheService) {
        this.connection = connection;
        this.cacheService = cacheService;
    }
    async initOptions() {
        await this.load(true);
    }
    async load(flag = false) {
        if (flag) {
            await this.cacheService.set(CACHE_KEY.OPTIONS, null);
        }
        let cacheOptions = await this.cacheService.get(CACHE_KEY.OPTIONS);
        if (_.isEmpty(cacheOptions)) {
            const data = await this.connection.getRepository(entity_1.Option).find();
            const result = {};
            data.forEach(item => {
                result[item.key] = item.value;
            });
            await this.cacheService.set(CACHE_KEY.OPTIONS, result);
            cacheOptions = await this.cacheService.get(CACHE_KEY.OPTIONS);
        }
        return cacheOptions;
    }
    async updateOptions(optionKey, optionValue) {
        const data = _.isObject(optionKey) ? _.extend({}, optionKey) : { [optionKey]: optionValue };
        let cacheOptions = await this.cacheService.get(CACHE_KEY.OPTIONS);
        if (_.isEmpty(cacheOptions)) {
            cacheOptions = await this.load();
        }
        const changedOptions = {};
        for (const tempKey in data) {
            if (data[tempKey] !== cacheOptions[tempKey]) {
                changedOptions[tempKey] = data[tempKey];
            }
        }
        const jsonSQL = `JSON_SET(value,'$.${optionValue.key}', '${optionValue.value}') WHERE \`key\` = '${optionKey}'`;
        if (_.isEmpty(changedOptions)) {
            return;
        }
        const updateResult = await this.connection
            .createQueryBuilder()
            .update(entity_1.Option)
            .set({ value: jsonSQL })
            .where('key = :key', { key: optionKey })
            .execute();
        if (updateResult) {
            return await this.load(true);
        }
        return await this.load();
    }
    async addSticky(key, itemId) {
        const options = await this.load();
        const stickys = options.stickys;
        for (const stickysKey in stickys) {
            if (stickysKey === key) {
                if (!stickys[key].includes(itemId)) {
                    stickys[key].unshift(itemId);
                    return await this.saveSticky(stickys);
                }
            }
        }
    }
    async removeSticky(key, itemId) {
        const options = await this.load();
        const stickys = options.stickys;
        for (const stickysKey in stickys) {
            if (stickysKey === key) {
                if (stickys[key].includes(itemId)) {
                    for (let i = 0; i < stickys[key].length; i++) {
                        if (stickys[key][i] === itemId) {
                            stickys[key].splice(i, 1);
                        }
                    }
                }
            }
        }
        await this.saveSticky(stickys);
    }
    async saveSticky(stickys) {
        const updateResult = await this.connection
            .createQueryBuilder()
            .update(entity_1.Option)
            .set({ value: stickys })
            .where('key = :key', { key: 'stickys' })
            .execute();
        return updateResult;
    }
};
OptionService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectConnection()),
    __metadata("design:paramtypes", [typeorm_2.Connection,
        cache_service_1.CacheService])
], OptionService);
exports.OptionService = OptionService;
//# sourceMappingURL=option.service.js.map