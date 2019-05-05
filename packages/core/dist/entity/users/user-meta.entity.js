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
var _a;
"use strict";
const base_entity_1 = require("../base.entity");
const user_entity_1 = require("user.entity");
const typeorm_1 = require("typeorm");
let UserMeta = class UserMeta extends base_entity_1.BaseEntity {
    constructor(input) {
        super(input);
    }
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserMeta.prototype, "key", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true,
        type: 'json',
        comment: '元信息值',
    }),
    __metadata("design:type", Object)
], UserMeta.prototype, "value", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_entity_1.UserEntity, user => user.metas, {
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", typeof (_a = typeof user_entity_1.UserEntity !== "undefined" && user_entity_1.UserEntity) === "function" ? _a : Object)
], UserMeta.prototype, "user", void 0);
UserMeta = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Object])
], UserMeta);
exports.UserMeta = UserMeta;
//# sourceMappingURL=user-meta.entity.js.map