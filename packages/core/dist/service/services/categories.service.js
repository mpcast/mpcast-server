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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const _ = __importStar(require("lodash"));
const typeorm_2 = require("typeorm");
const cache_service_1 = require("../../cache/cache.service");
const CACHE_KEY = __importStar(require("../../common/constants/cache.constant"));
const entity_1 = require("../../entity");
const attachment_service_1 = require("./attachment.service");
let CategoriesService = class CategoriesService {
    constructor(connection, cacheService, attachmentService) {
        this.connection = connection;
        this.cacheService = cacheService;
        this.attachmentService = attachmentService;
    }
    async findTermBySlug(taxonomy, slug) {
        const data = await this.connection.manager
            .createQueryBuilder()
            .select()
            .from(entity_1.TermTaxonomy, 'tt')
            .innerJoin(query => {
            return query.from(entity_1.Term, 't');
        }, 't', 'tt.termId = t.id')
            .where('tt.taxonomy = :taxonomy', { taxonomy })
            .andWhere('t.slug = :slug', { slug })
            .getRawOne();
        return data;
    }
    async findCategoriesByObject(objectId) {
        const taxonomy = 'category';
        const allTerms = await this.cacheService.get(CACHE_KEY.TERMS);
        const taxonomies = await this.connection.manager
            .createQueryBuilder(entity_1.TermRelationships, 'tt')
            .where(`objectId = :objectId`, { objectId })
            .getRawMany();
        const terms = [];
        taxonomies.forEach(item => {
            terms.push(_.filter(allTerms, {
                taxonomyId: item.taxonomyId,
                taxonomy,
            }));
        });
        return _.flattenDeep(terms);
    }
    async formatTermForObject(objectId) {
        const allTerms = await this.cacheService.get(CACHE_KEY.TERMS);
        const taxonomies = await this.connection.manager
            .createQueryBuilder(entity_1.TermRelationships, 'tt')
            .select(`taxonomyId as termId`)
            .where(`objectId = :objectId`, { objectId })
            .getRawMany();
        const curPostHasTerms = _.intersectionBy(allTerms, taxonomies, 'termId');
        const postFormat = _.findLast(curPostHasTerms, (o) => {
            return (o.slug.toString().indexOf('post-format') >= 0);
        });
        return postFormat;
    }
    async getFromCategory(categorySlug, status, querys) {
        const pageSize = querys.pageSize ? querys.pageSize : 10;
        const page = querys.page ? querys.page * pageSize : 1;
        let where;
        if (_.isEmpty(status)) {
            where = `obj.status NOT IN ('trash')`;
        }
        else {
            where = `obj.status = '${status}'`;
        }
        let data;
        data = await this.connection.manager
            .createQueryBuilder()
            .select('obj.*, tt.description as category')
            .from(entity_1.Term, 't')
            .innerJoin(query => {
            return query.from(entity_1.TermTaxonomy, 'tt');
        }, 'tt', 'tt.id = t.id')
            .innerJoin(query => {
            return query.from(entity_1.TermRelationships, 'tr');
        }, 'tr', 'tr.taxonomyId = tt.id')
            .innerJoin(query => {
            return query.from(entity_1.PostEntity, 'obj');
        }, 'obj', 'obj.id = tr.objectId')
            .where('obj.type = :type', { type: 'page' })
            .andWhere(where)
            .andWhere('t.slug = :categorySlug', { categorySlug })
            .orderBy('obj.updatedAt', 'DESC')
            .offset(page)
            .limit(pageSize)
            .getRawMany();
        const objIds = [];
        data.forEach(item => {
            objIds.push(item.id);
        });
        if (!_.isEmpty(objIds)) {
            const metaData = await this.connection.getRepository(entity_1.PostMeta).find({
                post: typeorm_2.In(objIds),
            });
            data.forEach(item => {
                item.metas = _.filter(metaData, { id: item.id });
            });
        }
        return data;
    }
    async getPopular(isRandom = false, limit = 10) {
        let data;
        const orderBy = !isRandom ? { viewCount: 'DESC' } : 'rand()';
        data = await this.connection.manager
            .createQueryBuilder()
            .select('p.*, JSON_LENGTH(value) as viewCount')
            .from(entity_1.PostEntity, 'p')
            .innerJoin(query => {
            return query.from(entity_1.PostMeta, 'meta');
        }, 'meta', 'meta.postId = p.id')
            .where('meta.key = :key', { key: '_post_views' })
            .orderBy(orderBy)
            .limit(limit)
            .getRawMany();
        return data;
    }
    async getNews(limit) {
        let data;
        data = await this.connection.manager
            .createQueryBuilder()
            .select('obj.*, tt.description as category')
            .from(entity_1.Term, 't')
            .innerJoin(query => {
            return query.from(entity_1.TermTaxonomy, 'tt');
        }, 'tt', 'tt.id = t.id')
            .innerJoin(query => {
            return query.from(entity_1.TermRelationships, 'tr');
        }, 'tr', 'tr.taxonomyId = tt.id')
            .innerJoin(query => {
            return query.from(entity_1.PostEntity, 'obj');
        }, 'obj', 'obj.id = tr.objectId')
            .where('obj.type = :type', { type: 'page' })
            .andWhere('obj.status IN (:status)', { status: 'publish' })
            .andWhere('tt.taxonomy = :category', { category: 'category' })
            .orderBy('obj.updatedAt', 'DESC')
            .limit(limit)
            .getRawMany();
        const objIds = [];
        data.forEach(item => {
            objIds.push(item.id);
        });
        if (!_.isEmpty(objIds)) {
            const metaData = await this.connection.getRepository(entity_1.PostMeta).find({
                post: typeorm_2.In(objIds),
            });
            data.forEach(item => {
                item.metas = _.filter(metaData, { id: item.id });
            });
        }
        return data;
    }
    async getStickys(stickys) {
        const data = await this.connection.manager
            .createQueryBuilder()
            .select()
            .from(entity_1.PostEntity, 'p')
            .where('p.id IN (:stickys)', { stickys })
            .orderBy(`INSTR (',${stickys},', CONCAT(',',id,','))`)
            .getRawMany();
        return data;
    }
    async getTermsByTaxonomy(taxonomy) {
        const allTerms = await this.loadAllTerms();
        const terms = allTerms.filter((term) => {
            return term.taxonomy === taxonomy;
        }).map((t) => Object.assign({}, t));
        for (const item of terms) {
            if (!Object.is(item.meta, undefined)) {
                if (!Object.is(item.meta._thumbnail_id, undefined)) {
                    item.featured_image = await this.attachmentService.getAttachment(item.meta._thumbnail_id);
                }
                Reflect.deleteProperty(item, 'meta');
            }
        }
        return terms;
    }
    async getTagsByObject(objectId) {
        const taxonomy = 'post_tag';
        const allTerms = await this.loadAllTerms();
    }
    async loadAllTerms(flag) {
        if (flag) {
            await this.cacheService.set(CACHE_KEY.TERMS, null);
        }
        let ret = await this.cacheService.get(CACHE_KEY.TERMS);
        if (_.isEmpty(ret)) {
            const data = await this.connection.manager
                .createQueryBuilder()
                .select()
                .from(entity_1.Term, 't')
                .innerJoin(query => {
                return query.from(entity_1.TermTaxonomy, 'tt');
            }, 'tt', 't.id = tt.termId')
                .orderBy('tt.id', 'ASC')
                .getRawMany();
            const ids = [];
            for (const item of data) {
                ids.push(item.termId);
            }
            const metaList = await this.connection.manager
                .createQueryBuilder()
                .select('tm.*')
                .from(entity_1.TermMeta, 'tm')
                .where('termId IN (:ids)', { ids })
                .getRawMany();
            const metaGroup = _.groupBy(metaList, 'termId');
            for (const key of Object.keys(metaGroup)) {
                for (const item of data) {
                    if (item.termId.toString() === key.toString()) {
                        item.metas = metaGroup[key];
                    }
                }
            }
            this.formatMeta(data);
            await this.cacheService.set(CACHE_KEY.TERMS, data);
            ret = await this.cacheService.get(CACHE_KEY.TERMS);
        }
        return ret;
    }
    formatMeta(list) {
        const items = [];
        for (const item of list) {
            item.meta = {};
            if (_.has(item, 'metas') && item.metas.length > 0) {
                for (const meta of item.metas) {
                    item.meta[meta.key] = meta.value;
                }
            }
            Reflect.deleteProperty(item, 'metas');
            items.push(item);
        }
        return items;
    }
};
CategoriesService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectConnection()),
    __metadata("design:paramtypes", [typeorm_2.Connection,
        cache_service_1.CacheService,
        attachment_service_1.AttachmentService])
], CategoriesService);
exports.CategoriesService = CategoriesService;
//# sourceMappingURL=categories.service.js.map