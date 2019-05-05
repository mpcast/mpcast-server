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
const term_entity_1 = require("term.entity");
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base.entity");
let TermTaxonomy = class TermTaxonomy extends base_entity_1.BaseEntity {
    constructor(input) {
        super(input);
    }
};
__decorate([
    typeorm_1.OneToOne(type => term_entity_1.Term, term => term.taxonomy),
    typeorm_1.Column({
        type: 'int',
        comment: '分类 id',
    }),
    __metadata("design:type", typeof (_a = typeof term_entity_1.Term !== "undefined" && term_entity_1.Term) === "function" ? _a : Object)
], TermTaxonomy.prototype, "term", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 200,
        comment: '分类法',
    }),
    __metadata("design:type", String)
], TermTaxonomy.prototype, "taxonomy", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 200,
        comment: '描述',
    }),
    __metadata("design:type", String)
], TermTaxonomy.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        comment: '父类',
        default: 0,
    }),
    __metadata("design:type", Object)
], TermTaxonomy.prototype, "parent", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        comment: '类别下面的内容数量',
        default: 0,
    }),
    __metadata("design:type", Number)
], TermTaxonomy.prototype, "count", void 0);
TermTaxonomy = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Object])
], TermTaxonomy);
exports.TermTaxonomy = TermTaxonomy;
//# sourceMappingURL=term-taxonomy.entity.js.map