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
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
let Option = class Option {
};
__decorate([
    typeorm_2.Column({ type: 'varchar', length: 100 }),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Option.prototype, "key", void 0);
__decorate([
    typeorm_2.Column('json', {
        nullable: true,
        comment: '元信息值',
    }),
    class_validator_1.IsJSON(),
    __metadata("design:type", Object)
], Option.prototype, "value", void 0);
__decorate([
    typeorm_2.Column('varchar', {
        nullable: true,
        length: 200,
        comment: '配置项描述',
    }),
    __metadata("design:type", String)
], Option.prototype, "description", void 0);
Option = __decorate([
    typeorm_1.Entity('options'),
    typeorm_1.Index(['key'])
], Option);
exports.Option = Option;
//# sourceMappingURL=option.entity.js.map