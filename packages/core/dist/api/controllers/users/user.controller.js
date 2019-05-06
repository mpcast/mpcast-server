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
const utils_1 = require("../../../common/utils");
const service_1 = require("../../../service");
const user_dto_1 = require("../../dtos/user.dto");
const auth_guard_1 = require("../../middleware/guards/auth.guard");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    createUser(userInput) {
        return this.userService.create(Object.assign({}, userInput));
    }
    async oneself(request) {
        const user = await this.userService.findByIdentifier(request.user.identifier);
        if (user) {
            utils_1.formatOneMeta(user);
            return user;
        }
        return null;
    }
    findOne(id) {
        return this.userService.getDetailById(id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    common_1.Get('me'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "oneself", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
UserController = __decorate([
    common_1.Controller('users'),
    __metadata("design:paramtypes", [service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map