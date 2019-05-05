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
const paginate_1 = require("../../common/paginate");
const common_types_1 = require("../../common/types/common-types");
const utils_1 = require("../../common/utils");
const entity_1 = require("../../entity");
const __1 = require("..");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const _ = __importStar(require("lodash"));
const typeorm_2 = require("typeorm");
let PostService = class PostService {
    constructor(connection, usersRepository, postRepository, categoriesService, optionService) {
        this.connection = connection;
        this.usersRepository = usersRepository;
        this.postRepository = postRepository;
        this.categoriesService = categoriesService;
        this.optionService = optionService;
    }
    async findById(id) {
        const data = await this.postRepository.findOne({
            where: {
                id,
            },
        });
        return data;
    }
    async loadBLock(blocks) {
        const dataList = await this.connection.manager.createQueryBuilder()
            .select()
            .from(entity_1.PostEntity, 'p')
            .where(`id IN (:blocks)`, { blocks })
            .orderBy(`INSTR (',${blocks},', CONCAT(',',id,','))`)
            .getRawMany();
        utils_1.formatAllMeta(dataList);
        for (const item of dataList) {
            const typeObject = await this.categoriesService.formatTermForObject(item.id);
            if (!_.isEmpty(typeObject)) {
                item.type = typeObject.slug;
                await this.getFormatData(item);
            }
        }
        return dataList;
    }
    async getFormatData(item) {
        switch (item.type) {
            case 'post-format-audio': {
                if (!_.isEmpty(item.block)) {
                    const postId = JSON.parse(item.block)[0];
                    const block = await this.getAttachmentInfo(postId);
                    if (!Object.is(block.meta._attachment_file, undefined)) {
                        item.guid = block.meta._attachment_file;
                    }
                    if (!Object.is(block.meta._attachment_metadata, undefined)) {
                        if (block.meta._attachment_metadata !== '{}') {
                            item = _.extend(item, block.meta._attachment_metadata);
                        }
                    }
                }
                Reflect.deleteProperty(item, 'meta');
                break;
            }
            default:
                break;
        }
        return item;
    }
    async getAttachmentInfo(id) {
        const data = await this.findById(id);
        return utils_1.formatOneMeta(data);
    }
    async getAudios(ids) {
        this.connection.manager
            .createQueryBuilder(entity_1.PostEntity, 'post')
            .orderBy(`INSTR (',${ids},', CONCAT(',',id,','))`);
    }
    async paginate(options) {
        return await paginate_1.paginate(this.postRepository, options, {
            type: 'page',
        });
    }
    async getFromCategory(categorySlug, status, querys) {
        const pageSize = querys.pagesize ? querys.pagesize : 10;
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
    async getStickys(stickys, querys) {
        const data = await this.connection.manager
            .createQueryBuilder()
            .select()
            .from(entity_1.PostEntity, 'p')
            .where('p.id IN (:stickys)', { stickys })
            .orderBy(`INSTR (',${stickys},', CONCAT(',',id,','))`)
            .getRawMany();
        const objIds = [];
        data.forEach(item => {
            objIds.push(item.id);
        });
        if (!_.isEmpty(objIds)) {
            const metaData = await this.connection.manager
                .createQueryBuilder()
                .select()
                .from(entity_1.PostMeta, 'pm')
                .where(`postId IN (:objIds)`, { objIds })
                .getRawMany();
            data.forEach(item => {
                item.metas = _.filter(metaData, { postId: item.id });
            });
        }
        return data;
    }
    async findAllByType(postType, userId, take) {
        const where = {
            status: 'publish',
            type: typeorm_2.In([postType]),
        };
        if (userId) {
            where.author = userId;
        }
        return await this.postRepository.find({
            where,
            take: take || 10,
            skip: 0,
            cache: true,
        });
    }
    async getAttachment(postId, type = 'file') {
        let where = {
            postId,
        };
        switch (type) {
            case 'file': {
                where = _.extend({ key: '_attachment_file' }, where);
                const attachment = await this.connection.manager.createQueryBuilder()
                    .select()
                    .from(entity_1.PostMeta, 'pm')
                    .where(`pm.key = :key AND pm.postId = :postId`, { key: '_attachment_file', postId })
                    .getRawOne();
                if (!_.isEmpty(attachment)) {
                    return JSON.parse(attachment.value);
                }
                return '';
            }
            case 'meta':
                break;
        }
    }
    async getAttachments(ids) {
        let where = {
            postId: typeorm_2.In(ids),
        };
        where = _.extend({ key: '_attachment_file' }, where);
        const list = await this.connection.getRepository(entity_1.PostMeta)
            .find({
            where,
        });
        return list;
    }
    async countByBehavior(behavior, postId) {
        const data = await this.connection.manager.createQueryBuilder()
            .select(`JSON_LENGTH(pm.value) as count`)
            .from(entity_1.PostMeta, 'pm')
            .where(`pm.postId = :postId AND pm.key = :key`, { postId, key: behavior })
            .getRawOne();
        if (!_.isEmpty(data)) {
            return data.count;
        }
        return 0;
    }
    async getUsersByBehavior(behavior, postId) {
        const data = await this.connection.manager.createQueryBuilder()
            .select()
            .from(entity_1.PostMeta, 'pm')
            .where(`pm.postId = :postId AND pm.key = :key`, { postId, key: behavior })
            .getRawOne();
        return data;
    }
    async newViewer(userId, postId, ip) {
        const hasViewer = await this.connection.getRepository(entity_1.PostMeta)
            .findOne({
            post: { id: postId },
            key: common_types_1.EUserPostsBehavior.VIEW,
        });
        if (!hasViewer) {
            await this.connection.getRepository(entity_1.PostMeta)
                .save({
                post: { id: postId },
                key: common_types_1.EUserPostsBehavior.VIEW,
                value: [],
            }).then(entity => {
            });
        }
        const updateResult = await this.connection.createQueryBuilder()
            .update(entity_1.PostMeta)
            .set({
            post: { id: postId },
            key: '_post_views',
            value: () => `JSON_ARRAY_APPEND(value, '$', JSON_OBJECT('id', '${userId}','ip', '${ip}', 'date', '${new Date().getTime()}'))`,
        })
            .where('postId = :postId AND `key` = :key', { postId, key: common_types_1.EUserPostsBehavior.VIEW })
            .execute();
        return updateResult;
    }
    async updateViewer(userId, postId, ip) {
        const updateResult = await this.connection.createQueryBuilder()
            .update(entity_1.PostMeta)
            .set({
            value: () => {
                return `
            JSON_REPLACE(
              value,
                CONCAT(
                    SUBSTRING_INDEX(
                        REPLACE(
                            JSON_SEARCH(value, 'one', '${userId}', NULL, '$**.id'),
                            '"', ''
                        ),
                    '.', 1),
                  '.date'
                ),
                '${new Date().getTime()}',
                CONCAT(
                    SUBSTRING_INDEX(
                        REPLACE(
                            JSON_SEARCH(value, 'one', '${userId}', NULL, '$**.id'),
                            '"', ''
                        ),
                    '.', 1),
                  '.ip'
              ),
             '${ip}'
            )`;
            },
        })
            .where('postId = :postId AND `key` = :key', { postId, key: common_types_1.EUserPostsBehavior.VIEW })
            .execute();
        return updateResult;
    }
};
PostService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectConnection()),
    __param(1, typeorm_1.InjectRepository(entity_1.UserEntity)),
    __param(2, typeorm_1.InjectRepository(entity_1.PostEntity)),
    __metadata("design:paramtypes", [typeorm_2.Connection,
        typeorm_2.Repository,
        typeorm_2.Repository,
        __1.CategoriesService,
        __1.OptionService])
], PostService);
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map