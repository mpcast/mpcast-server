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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const http_decorator_1 = require("../../../decorators/http.decorator");
const query_params_decorator_1 = require("../../../decorators/query-params.decorator");
const service_1 = require("../../../service");
const auth_dto_1 = require("../../dtos/auth.dto");
const auth_guard_1 = require("../../middleware/guards/auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    createToken({ visitors: { ip } }, body) {
        return this.authService.authenticate(body.identifier, body.password).then(token => {
            console.log(token);
            return token;
        });
    }
    getUser(req) {
        return this.authService.getUserFromIdentifier(req.user.identifier);
    }
    checkToken() {
        return 'ok';
    }
};
__decorate([
    common_1.Post('login'),
    http_decorator_1.HttpProcessor.handle({ message: '登陆', error: common_1.HttpStatus.BAD_REQUEST }),
    __param(0, query_params_decorator_1.QueryParams()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.AuthLogin]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createToken", null);
__decorate([
    common_1.Get('user'),
    http_decorator_1.HttpProcessor.handle({ message: '权限用户信息获取', error: common_1.HttpStatus.BAD_REQUEST }),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getUser", null);
__decorate([
    common_1.Post('check'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('检测 Token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AuthController.prototype, "checkToken", null);
AuthController = __decorate([
    common_1.Controller('/auth'),
    __metadata("design:paramtypes", [service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map