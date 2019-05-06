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
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const APP_CONFIG = __importStar(require("../app.config"));
const jwt_strategy_1 = require("../common/jwt.strategy");
const service_module_1 = require("../service/service.module");
const auth_controller_1 = require("./controllers/auth/auth.controller");
const categories_controller_1 = require("./controllers/categories/categories.controller");
const comment_controller_1 = require("./controllers/comments/comment.controller");
const option_controller_1 = require("./controllers/options/option.controller");
const post_controller_1 = require("./controllers/posts/post.controller");
const user_controller_1 = require("./controllers/users/user.controller");
const wechat_controller_1 = require("./controllers/wechat/wechat.controller");
const controllers = [
    auth_controller_1.AuthController,
    categories_controller_1.CategoriesController,
    comment_controller_1.CommentController,
    option_controller_1.OptionController,
    post_controller_1.PostController,
    user_controller_1.UserController,
    wechat_controller_1.WechatController,
];
let RestApiModule = class RestApiModule {
};
RestApiModule = __decorate([
    common_1.Module({
        imports: [
            passport_1.PassportModule.register({
                defaultStrategy: 'jwt',
            }),
            jwt_1.JwtModule.register({
                secretOrPrivateKey: APP_CONFIG.AUTH.jwtTokenSecret,
                signOptions: { expiresIn: APP_CONFIG.AUTH.expiresIn },
            }),
        ],
        controllers: [...controllers],
        providers: [service_module_1.ServiceModule, jwt_strategy_1.JwtStrategy],
    })
], RestApiModule);
exports.RestApiModule = RestApiModule;
//# sourceMappingURL=api-internal-modules.js.map