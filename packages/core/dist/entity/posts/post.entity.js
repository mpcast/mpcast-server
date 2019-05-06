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
const base_entity_1 = require("../base.entity");
const post_meta_entity_1 = require("./post-meta.entity");
let PostEntity = class PostEntity extends base_entity_1.BaseEntity {
    constructor(input) {
        super(input);
    }
};
__decorate([
    typeorm_1.Column({
        name: 'author',
        type: 'int',
        comment: '作者',
        nullable: true,
    }),
    __metadata("design:type", Number)
], PostEntity.prototype, "author", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        default: 'publish',
        comment: '内容状态',
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '读取密码',
        nullable: true,
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({
        name: 'title',
        type: 'text',
        comment: '内容标题',
        nullable: true,
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        comment: '内容标识',
        type: 'varchar',
        length: 200,
        nullable: true,
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: 'guid',
        comment: '网络唯一地址 Global Unique ID for referencing the post.',
        nullable: true,
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "guid", void 0);
__decorate([
    typeorm_1.Column({
        comment: '内容摘要',
        nullable: true,
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "excerpt", void 0);
__decorate([
    typeorm_1.Column({
        name: 'type',
        default: 'post',
        comment: '内容类型',
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "type", void 0);
__decorate([
    typeorm_1.Column('text', {
        name: 'content',
        comment: '内容 block',
        nullable: true,
    }),
    class_validator_1.IsArray(),
    __metadata("design:type", Array)
], PostEntity.prototype, "content", void 0);
__decorate([
    typeorm_1.Column('json', {
        comment: '内容区块',
        nullable: true,
    }),
    class_validator_1.IsJSON(),
    __metadata("design:type", Object)
], PostEntity.prototype, "block", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        comment: '格式',
        default: false,
    }),
    __metadata("design:type", Boolean)
], PostEntity.prototype, "allowComment", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], PostEntity.prototype, "commentNum", void 0);
__decorate([
    typeorm_1.Column({
        name: 'parent',
        comment: '父级内容',
        unsigned: true,
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], PostEntity.prototype, "parent", void 0);
__decorate([
    typeorm_1.Column({
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "mimeType", void 0);
__decorate([
    typeorm_1.Column({
        comment: '菜单顺序',
        default: 0,
    }),
    __metadata("design:type", Number)
], PostEntity.prototype, "menuOrder", void 0);
__decorate([
    typeorm_1.Column({
        comment: '排序',
        default: 0,
    }),
    __metadata("design:type", Number)
], PostEntity.prototype, "sort", void 0);
__decorate([
    typeorm_1.OneToMany(type => post_meta_entity_1.PostMeta, postMeta => postMeta.post, {
        cascade: true,
        eager: true,
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Array)
], PostEntity.prototype, "metas", void 0);
PostEntity = __decorate([
    typeorm_1.Entity('posts'),
    __metadata("design:paramtypes", [Object])
], PostEntity);
exports.PostEntity = PostEntity;
//# sourceMappingURL=post.entity.js.map