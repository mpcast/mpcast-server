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
const term_meta_entity_1 = require("./term-meta.entity");
const term_taxonomy_entity_1 = require("./term-taxonomy.entity");
let Term = class Term extends base_entity_1.BaseEntity {
    constructor(input) {
        super(input);
    }
};
__decorate([
    typeorm_1.Column('varchar', {
        length: 200,
        comment: '名称',
    }),
    __metadata("design:type", String)
], Term.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 200,
        comment: '名称地址标识',
        unique: true,
    }),
    __metadata("design:type", String)
], Term.prototype, "slug", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        comment: '排序分组',
        default: 0,
    }),
    __metadata("design:type", Number)
], Term.prototype, "group", void 0);
__decorate([
    typeorm_1.OneToMany(type => term_meta_entity_1.TermMeta, termMeta => termMeta.term, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Term.prototype, "metas", void 0);
__decorate([
    typeorm_1.OneToOne(type => term_taxonomy_entity_1.TermTaxonomy, termTaxonomy => termTaxonomy.term, {
        cascade: true,
    }),
    __metadata("design:type", term_taxonomy_entity_1.TermTaxonomy)
], Term.prototype, "taxonomy", void 0);
Term = __decorate([
    typeorm_1.Entity('terms'),
    __metadata("design:paramtypes", [Object])
], Term);
exports.Term = Term;
//# sourceMappingURL=term.entity.js.map