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
const service_1 = require("../../../service");
const auth_guard_1 = require("../../middleware/guards/auth.guard");
let CommentController = class CommentController {
    constructor(userService, commentService) {
        this.userService = userService;
        this.commentService = commentService;
    }
    async index(page = 0, limit = 10) {
        limit = limit > 100 ? 100 : limit;
        const data = await this.commentService.paginate({
            page,
            limit,
            route: 'posts',
        });
        return data;
    }
    async one(id) {
        const data = await this.commentService.findById(id);
        return data;
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Query('page')), __param(1, common_1.Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "index", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "one", null);
CommentController = __decorate([
    common_1.Controller('comments'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [service_1.UserService,
        service_1.CommentService])
], CommentController);
exports.CommentController = CommentController;
//# sourceMappingURL=comment.controller.js.map