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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const paginate_1 = require("../../common/paginate");
const utils_1 = require("../../common/utils");
const entity_1 = require("../../entity");
let CommentService = class CommentService {
    constructor(connection, usersRepository) {
        this.connection = connection;
        this.usersRepository = usersRepository;
    }
    async paginate(options) {
        const paginationObj = await paginate_1.paginate(this.connection.getRepository(entity_1.CommentEntity), options, {
            relations: ['user'],
            loadRelationIds: {
                relations: ['post'],
            },
        });
        utils_1.formatAllMeta(paginationObj.items, {
            filterKey: 'user',
            cleanMeta: true,
        });
        return paginationObj;
    }
    async findById(id) {
        const data = await this.connection.getRepository(entity_1.CommentEntity).findOne({
            relations: ['user'],
            where: {
                id,
            },
        });
        utils_1.formatOneMeta(data, {
            filterKey: 'user',
            cleanMeta: true,
        });
        return data;
    }
    async create(comment) {
        const data = await this.connection.getRepository(entity_1.CommentEntity).save(comment);
        utils_1.formatOneMeta(data);
        return data;
    }
};
CommentService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectConnection()),
    __param(1, typeorm_1.InjectRepository(entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Connection,
        typeorm_2.Repository])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map