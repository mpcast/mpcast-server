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
let OptionController = class OptionController {
    constructor(optionService) {
        this.optionService = optionService;
    }
    async index(type) {
        const allOption = await this.optionService.load();
        const foundOption = allOption[type];
        if (foundOption) {
            if (type === 'minapp') {
                Reflect.deleteProperty(foundOption, 'config');
            }
            return foundOption;
        }
    }
    all() {
        return this.optionService.load(true);
    }
};
__decorate([
    common_1.Get(':type'),
    __param(0, common_1.Param('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OptionController.prototype, "index", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OptionController.prototype, "all", null);
OptionController = __decorate([
    common_1.Controller('options'),
    __metadata("design:paramtypes", [service_1.OptionService])
], OptionController);
exports.OptionController = OptionController;
//# sourceMappingURL=option.controller.js.map