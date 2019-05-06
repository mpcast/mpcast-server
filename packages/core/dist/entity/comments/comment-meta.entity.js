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
const comment_entity_1 = require("./comment.entity");
let CommentMeta = class CommentMeta extends base_entity_1.BaseEntity {
    constructor(input) {
        super(input);
    }
};
__decorate([
    typeorm_1.Column({
        name: 'key',
        comment: '元数据键标识',
    }),
    __metadata("design:type", String)
], CommentMeta.prototype, "key", void 0);
__decorate([
    typeorm_1.Column({
        name: 'value',
        type: 'json',
        nullable: true,
        comment: '元数据值',
    }),
    __metadata("design:type", Object)
], CommentMeta.prototype, "value", void 0);
__decorate([
    typeorm_1.ManyToOne(type => comment_entity_1.CommentEntity, comment => comment.metas, {
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", comment_entity_1.CommentEntity)
], CommentMeta.prototype, "comment", void 0);
CommentMeta = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Object])
], CommentMeta);
exports.CommentMeta = CommentMeta;
//# sourceMappingURL=comment-meta.entity.js.map