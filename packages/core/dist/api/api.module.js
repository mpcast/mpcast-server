"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cache_module_1 = require("../cache/cache.module");
const cache_interceptor_1 = require("../interceptors/cache.interceptor");
const service_module_1 = require("../service/service.module");
const auth_controller_1 = require("./controllers/auth/auth.controller");
const categories_controller_1 = require("./controllers/categories/categories.controller");
const comment_controller_1 = require("./controllers/comments/comment.controller");
const option_controller_1 = require("./controllers/options/option.controller");
const post_controller_1 = require("./controllers/posts/post.controller");
const user_controller_1 = require("./controllers/users/user.controller");
const wechat_controller_1 = require("./controllers/wechat/wechat.controller");
const auth_guard_1 = require("./middleware/guards/auth.guard");
const humanized_auth_guard_1 = require("./middleware/guards/humanized-auth.guard");
const controllers = [
    auth_controller_1.AuthController,
    categories_controller_1.CategoriesController,
    comment_controller_1.CommentController,
    option_controller_1.OptionController,
    post_controller_1.PostController,
    user_controller_1.UserController,
    wechat_controller_1.WechatController,
];
let ApiModule = class ApiModule {
};
ApiModule = __decorate([
    common_1.Module({
        imports: [
            cache_module_1.CacheModule,
            service_module_1.ServiceModule,
        ],
        controllers: [...controllers],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: cache_interceptor_1.HttpCacheInterceptor,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: humanized_auth_guard_1.HumanizedJwtAuthGuard,
            },
        ],
    })
], ApiModule);
exports.ApiModule = ApiModule;
//# sourceMappingURL=api.module.js.map