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
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const __1 = require("..");
const base_entity_1 = require("../base.entity");
const comment_entity_1 = require("../comments/comment.entity");
let User = class User extends base_entity_1.BaseEntity {
    constructor(input) {
        super(input);
    }
};
__decorate([
    typeorm_2.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "identifier", void 0);
__decorate([
    typeorm_2.Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "displayName", void 0);
__decorate([
    typeorm_2.Column({ select: false, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    typeorm_2.Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "verified", void 0);
__decorate([
    typeorm_2.Column({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "verificationToken", void 0);
__decorate([
    typeorm_2.Column({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "identifierChangeToken", void 0);
__decorate([
    typeorm_1.OneToMany(type => __1.UserMeta, userMeta => userMeta.user, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "metas", void 0);
__decorate([
    typeorm_1.OneToMany(type => comment_entity_1.Comment, c => c.author, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
User = __decorate([
    typeorm_1.Entity('users'),
    __metadata("design:paramtypes", [Object])
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map