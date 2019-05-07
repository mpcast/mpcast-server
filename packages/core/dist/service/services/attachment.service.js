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
const utils_1 = require("../../common/utils");
const entity_1 = require("../../entity");
let AttachmentService = class AttachmentService {
    constructor(connection) {
        this.connection = connection;
    }
    async findById(id) {
        return await this.connection.getRepository(entity_1.Post)
            .findOne({
            id,
        });
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
            .createQueryBuilder(entity_1.Post, 'post')
            .orderBy(`INSTR (',${ids},', CONCAT(',',id,','))`);
    }
    async getAttachment(postId, type = 'file') {
        let where = {
            postId,
        };
        switch (type) {
            case 'file': {
                where = _.extend({ key: '_attachment_file' }, where);
                const attachment = await this.connection.manager
                    .createQueryBuilder()
                    .select()
                    .from(entity_1.PostMeta, 'pm')
                    .where(`pm.key = :key AND pm.postId = :postId`, { key: '_attachment_file', postId })
                    .getRawOne();
                if (!_.isEmpty(attachment)) {
                    return JSON.parse(attachment.value);
                }
                break;
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
};
AttachmentService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectConnection()),
    __metadata("design:paramtypes", [typeorm_2.Connection])
], AttachmentService);
exports.AttachmentService = AttachmentService;
//# sourceMappingURL=attachment.service.js.map