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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cache_module_1 = require("../cache/cache.module");
const config_helpers_1 = require("../config/config-helpers");
const event_bus_module_1 = require("../event-bus/event-bus.module");
const password_ciper_1 = require("./helpers/password-cipher/password-ciper");
const attachment_service_1 = require("./services/attachment.service");
const auth_service_1 = require("./services/auth.service");
const categories_service_1 = require("./services/categories.service");
const comment_service_1 = require("./services/comment.service");
const option_service_1 = require("./services/option.service");
const post_service_1 = require("./services/post.service");
const term_service_1 = require("./services/term.service");
const user_service_1 = require("./services/user.service");
const exportedProviders = [
    attachment_service_1.AttachmentService,
    auth_service_1.AuthService,
    option_service_1.OptionService,
    term_service_1.TermService,
    categories_service_1.CategoriesService,
    post_service_1.PostService,
    comment_service_1.CommentService,
    user_service_1.UserService,
];
let ServiceModule = class ServiceModule {
    constructor(optionService, userService) {
        this.optionService = optionService;
        this.userService = userService;
    }
    async onModuleInit() {
        await this.optionService.initOptions();
    }
};
ServiceModule = __decorate([
    common_1.Module({
        imports: [event_bus_module_1.EventBusModule, typeorm_1.TypeOrmModule.forRoot(config_helpers_1.getConfig().dbConnectionOptions), cache_module_1.CacheModule],
        providers: [
            ...exportedProviders,
            password_ciper_1.PasswordCiper,
        ],
        exports: exportedProviders,
    }),
    __metadata("design:paramtypes", [option_service_1.OptionService,
        user_service_1.UserService])
], ServiceModule);
exports.ServiceModule = ServiceModule;
//# sourceMappingURL=service.module.js.map