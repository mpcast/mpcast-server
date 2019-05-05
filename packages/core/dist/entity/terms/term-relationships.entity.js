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
let TermRelationships = class TermRelationships {
};
__decorate([
    typeorm_1.PrimaryColumn({
        type: 'int',
        comment: '内容对象 id',
    }),
    __metadata("design:type", Number)
], TermRelationships.prototype, "objectId", void 0);
__decorate([
    typeorm_1.PrimaryColumn({
        type: 'int',
        comment: '分类法 id',
    }),
    __metadata("design:type", Number)
], TermRelationships.prototype, "taxonomyId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        comment: '分类排序',
        default: 0,
    }),
    __metadata("design:type", Number)
], TermRelationships.prototype, "sort", void 0);
TermRelationships = __decorate([
    typeorm_1.Entity()
], TermRelationships);
exports.TermRelationships = TermRelationships;
//# sourceMappingURL=term-relationships.entity.js.map