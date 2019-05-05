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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const APP_CONFIG = __importStar(require("../../app.config"));
const unauthorized_error_1 = require("../../common/errors/unauthorized.error");
const utils_1 = require("../../common/utils");
const entity_1 = require("../../entity");
const password_ciper_1 = require("../helpers/password-cipher/password-ciper");
let AuthService = class AuthService {
    constructor(connection, passwordCipher, jwtService) {
        this.connection = connection;
        this.passwordCipher = passwordCipher;
        this.jwtService = jwtService;
    }
    async validateAuthData(payload) {
        if (payload.type === 'wechat' || payload.type === 'member') {
            const user = await this.connection.getRepository(entity_1.UserEntity).findOne({
                identifier: payload.identifier,
            });
            if (user) {
                return payload;
            }
            return null;
        }
    }
    async authenticate(identifier, password) {
        const user = await this.getUserFromIdentifier(identifier);
        await this.verifyUserPassword(user.id, password);
        const userObj = utils_1.formatOneMeta(user, { cleanMeta: true });
        const token = this.jwtService.sign({
            type: userObj.type,
            identifier,
            id: user.id,
        });
        return Promise.resolve({
            token,
            expiresIn: APP_CONFIG.AUTH.expiresIn,
        });
    }
    async verifyUserPassword(userId, password) {
        const user = await this.connection.getRepository(entity_1.UserEntity).findOne({
            loadEagerRelations: false,
            where: {
                id: userId,
            },
            select: ['passwordHash'],
        });
        if (!user) {
            throw new unauthorized_error_1.HttpUnauthorizedError();
        }
        const passwordMathces = await this.passwordCipher.check(password, user.passwordHash ? user.passwordHash : '');
        if (!passwordMathces) {
            throw new unauthorized_error_1.HttpUnauthorizedError();
        }
        return true;
    }
    async getUserFromIdentifier(identifier) {
        const user = await this.connection.getRepository(entity_1.UserEntity).findOne({
            where: {
                identifier,
            },
        });
        if (!user) {
            throw new unauthorized_error_1.HttpUnauthorizedError();
        }
        const me = utils_1.formatOneMeta(user);
        return user;
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectConnection()),
    __metadata("design:paramtypes", [typeorm_2.Connection,
        password_ciper_1.PasswordCiper,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map