"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const cache_service_1 = require("./cache.service");
const cache_service_config_1 = require("./cache.service.config");
let CacheModule = class CacheModule {
};
CacheModule = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [
            common_1.CacheModule.registerAsync({
                useClass: cache_service_config_1.CacheConfigService,
                inject: [cache_service_config_1.CacheConfigService],
            }),
        ],
        providers: [cache_service_config_1.CacheConfigService, cache_service_1.CacheService],
        exports: [cache_service_1.CacheService],
    })
], CacheModule);
exports.CacheModule = CacheModule;
//# sourceMappingURL=cache.module.js.map