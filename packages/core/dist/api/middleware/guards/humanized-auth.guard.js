"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const unauthorized_error_1 = require("../../../common/errors/unauthorized.error");
let HumanizedJwtAuthGuard = class HumanizedJwtAuthGuard extends passport_1.AuthGuard('jwt') {
    canActivate(context) {
        return super.canActivate(context);
    }
    handleRequest(error, authInfo, errInfo) {
        const okToken = !!authInfo;
        const noToken = !authInfo && errInfo && errInfo.message === 'No auth token';
        if (!error && (okToken || noToken)) {
            return authInfo;
        }
        else {
            throw error || new unauthorized_error_1.HttpUnauthorizedError(undefined, errInfo && errInfo.message);
        }
    }
};
HumanizedJwtAuthGuard = __decorate([
    common_1.Injectable()
], HumanizedJwtAuthGuard);
exports.HumanizedJwtAuthGuard = HumanizedJwtAuthGuard;
//# sourceMappingURL=humanized-auth.guard.js.map