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
const jwt_1 = require("@nestjs/jwt");
const wechat_jssdk_1 = require("wechat-jssdk");
const APP_CONFIG = __importStar(require("../../../app.config"));
const cache_service_1 = require("../../../cache/cache.service");
const CACHE_KEY = __importStar(require("../../../common/constants/cache.constant"));
const http_decorator_1 = require("../../../decorators/http.decorator");
const service_1 = require("../../../service");
const auth_guard_1 = require("../../middleware/guards/auth.guard");
let WechatController = class WechatController {
    constructor(jwtService, usersService, cacheService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.cacheService = cacheService;
        this.wechatConfig = {
            appId: 'appId',
            appSecret: 'appSecret',
            miniProgram: {
                appId: 'wx53d04eb9e7c3d68d',
                appSecret: '71ac7ed4bf869bc2b7b578395a89eb44',
            },
        };
        this.wx = new wechat_jssdk_1.Wechat(this.wechatConfig);
        this.mp = this.wx.miniProgram;
    }
    async login(code) {
        const { openid, session_key } = await this.mp.getSession(code);
        if (session_key) {
            const user = await this.usersService.createOrUpdate({
                identifier: openid,
            });
            await this.cacheService.set(`${CACHE_KEY.WECHAT_SESSION_KEY}${openid}`, session_key);
            const token = this.jwtService.sign({
                type: 'wechat',
                identifier: openid,
                id: user.id,
            });
            return Promise.resolve({
                token,
                expires_in: APP_CONFIG.AUTH.expiresIn,
            });
        }
    }
    async verifySignature(req, body) {
        const sessionKey = await this.cacheService.get(`${CACHE_KEY.WECHAT_SESSION_KEY}${req.user}`);
        try {
            await this.mp.verifySignature(body.rawData, body.signature, sessionKey);
            return 'ok';
        }
        catch (e) {
            throw e;
        }
    }
    async decryptData(req, body) {
        const sessionKey = await this.cacheService.get(`${CACHE_KEY.WECHAT_SESSION_KEY}${req.user}`);
        const res = await this.mp.decryptData(body.encryptedData, body.iv, sessionKey);
        const user = await this.usersService.findByIdentifier(req.user);
        if (user && user.metas) {
            for (const meta of user.metas) {
                if (meta.key === '_wechat') {
                    meta.value = res;
                }
            }
            const newUser = await this.usersService.updateUser(user);
            const resData = {};
            if (newUser && newUser.metas) {
                for (const meta of newUser.metas) {
                    if (meta.key === '_wechat') {
                        Object.assign(resData, Object.assign({ id: newUser.id }, meta.value));
                    }
                }
            }
            return resData;
        }
    }
    check(body) {
        return false;
    }
    me(req) {
    }
};
__decorate([
    common_1.Get(':code'),
    __param(0, common_1.Param('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "login", null);
__decorate([
    common_1.Post('verify'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle({ message: '数据完整性验证', error: common_1.HttpStatus.FORBIDDEN }),
    __param(0, common_1.Req()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "verifySignature", null);
__decorate([
    common_1.Post('decrypt'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Req()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "decryptData", null);
__decorate([
    common_1.Post('check'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Boolean)
], WechatController.prototype, "check", null);
__decorate([
    common_1.Post('me'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WechatController.prototype, "me", null);
WechatController = __decorate([
    common_1.Controller('wechat'),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        service_1.UserService,
        cache_service_1.CacheService])
], WechatController);
exports.WechatController = WechatController;
//# sourceMappingURL=wechat.controller.js.map