"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const app_environment_1 = require("../app.environment");
let LoggingInterceptor = class LoggingInterceptor {
    intercept(context, next) {
        if (!app_environment_1.isDevMode) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const content = request.method + ' -> ' + request.url;
        console.log('+ 收到请求：', content);
        const now = Date.now();
        return next.handle().pipe(operators_1.tap(() => console.log('- 响应请求：', content, `${Date.now() - now}ms`)));
    }
};
LoggingInterceptor = __decorate([
    common_1.Injectable()
], LoggingInterceptor);
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=logging.interceptor.js.map