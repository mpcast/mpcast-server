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
const post_entity_1 = require("./post.entity");
let PostMeta = class PostMeta extends base_entity_1.BaseEntity {
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
], PostMeta.prototype, "key", void 0);
__decorate([
    typeorm_1.Column({
        name: 'value',
        type: 'json',
        nullable: true,
        comment: '元数据值',
    }),
    __metadata("design:type", Object)
], PostMeta.prototype, "value", void 0);
__decorate([
    typeorm_1.ManyToOne(type => post_entity_1.Post, post => post.metas, {
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", post_entity_1.Post)
], PostMeta.prototype, "post", void 0);
PostMeta = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Object])
], PostMeta);
exports.PostMeta = PostMeta;
//# sourceMappingURL=post-meta.entity.js.map