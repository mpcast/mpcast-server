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
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base.entity");
const term_entity_1 = require("term.entity");
let TermMeta = class TermMeta extends base_entity_1.BaseEntity {
    constructor(input) {
        super(input);
    }
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TermMeta.prototype, "key", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true,
        type: 'text',
        comment: '元信息值',
    }),
    __metadata("design:type", Object)
], TermMeta.prototype, "value", void 0);
__decorate([
    typeorm_1.ManyToOne(type => term_entity_1.Term, term => term.metas, {
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", typeof (_a = typeof term_entity_1.Term !== "undefined" && term_entity_1.Term) === "function" ? _a : Object)
], TermMeta.prototype, "term", void 0);
TermMeta = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Object])
], TermMeta);
exports.TermMeta = TermMeta;
//# sourceMappingURL=term-meta.entity.js.map