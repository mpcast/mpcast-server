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
const base_entity_1 = require("../base.entity");
const comment_meta_entity_1 = require("./comment-meta.entity");
let Comment = class Comment extends base_entity_1.BaseEntity {
    constructor(input) {
        super(input);
    }
};
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        default: 'approved',
        comment: '内容状态',
    }),
    __metadata("design:type", String)
], Comment.prototype, "approved", void 0);
__decorate([
    typeorm_1.Column('text', {
        comment: '留言内容',
    }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        comment: 'IP 地址',
    }),
    __metadata("design:type", String)
], Comment.prototype, "ip", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], Comment.prototype, "commentCount", void 0);
__decorate([
    typeorm_1.Column({
        comment: '父级内容',
        unsigned: true,
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], Comment.prototype, "parent", void 0);
__decorate([
    typeorm_1.OneToMany(type => comment_meta_entity_1.CommentMeta, commentMeta => commentMeta.replay, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Comment.prototype, "metas", void 0);
Comment = __decorate([
    typeorm_1.Entity('comments'),
    __metadata("design:paramtypes", [Object])
], Comment);
exports.Comment = Comment;
//# sourceMappingURL=comment.entity.js.map