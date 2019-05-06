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
const _ = __importStar(require("lodash"));
const common_types_1 = require("../../../common/types/common-types");
const utils_1 = require("../../../common/utils");
const http_decorator_1 = require("../../../decorators/http.decorator");
const query_params_decorator_1 = require("../../../decorators/query-params.decorator");
const entity_1 = require("../../../entity");
const service_1 = require("../../../service");
const auth_guard_1 = require("../../middleware/guards/auth.guard");
let PostController = class PostController {
    constructor(userService, postService, optionService, categoriesService, attachmentService, commentService) {
        this.userService = userService;
        this.postService = postService;
        this.optionService = optionService;
        this.categoriesService = categoriesService;
        this.attachmentService = attachmentService;
        this.commentService = commentService;
    }
    async index(page = 0, limit = 10) {
        limit = limit > 100 ? 100 : limit;
        const data = await this.postService.paginate({
            page,
            limit,
            route: 'posts',
        });
        await this.dealDataList(data.items);
        return data;
    }
    async findByCategory(req, category, page = 0, limit = 10) {
        const query = req.query;
        let list;
        switch (category) {
            case 'new': {
                list = await this.postService.getNews(10);
                break;
            }
            case 'popular': {
                list = await this.postService.getPopular();
                break;
            }
            case 'featured': {
                const options = await this.optionService.load(true);
                const stickys = options.stickys;
                list = await this.postService.getStickys(stickys.default);
                break;
            }
            default: {
                list = await this.postService.getFromCategory(category, undefined, query);
            }
        }
        list = await this.dealDataList(list);
        return list;
    }
    async getViews(postId, req) {
        const result = await this.postService.getUsersByBehavior(common_types_1.EUserPostsBehavior.VIEW, postId);
        let iView = false;
        let found = 0;
        const views = [];
        if (!_.isEmpty(result)) {
            if (!_.isEmpty(result.value)) {
                const list = JSON.parse(result.value);
                const exists = _.find(list, ['id', req.user.id]);
                if (exists) {
                    iView = true;
                }
                found = list.length;
                const users = await this.userService.getUsersDetailByIds(_.filter(list, 'id'));
                views.push(...users);
            }
        }
        if (views.length > 0) {
            utils_1.formatAllMeta(views);
            for (const user of views) {
                Reflect.deleteProperty(user, 'meta');
            }
        }
        return {
            found,
            iView,
            postId,
            views,
        };
    }
    async newViewer(postId, req, params) {
        const ip = params.visitors.ip;
        const result = await this.postService.getUsersByBehavior(common_types_1.EUserPostsBehavior.VIEW, postId);
        let iView = false;
        let viewCount = 0;
        let updateResult;
        if (!_.isEmpty(result)) {
            if (!_.isEmpty(result.value)) {
                const list = JSON.parse(result.value);
                viewCount = list.length;
                iView = _.find(list, item => {
                    return item.id.toString() === req.user.id.toString();
                });
                if (!iView) {
                    updateResult = await this.postService.newViewer(req.user.id, postId, ip);
                    if (updateResult) {
                        viewCount++;
                    }
                }
                else {
                    await this.postService.updateViewer(req.user.id, postId, ip);
                }
            }
        }
        else {
            updateResult = await this.postService.newViewer(req.user.id, postId, ip);
            if (updateResult) {
                viewCount++;
            }
        }
        return {
            iView: true,
            viewCount,
            postId,
        };
    }
    async getComments(postId, req, page, limit) {
        limit = limit > 100 ? 100 : limit;
        const data = await this.commentService.paginate({
            page,
            limit,
            route: 'posts',
        });
        return data;
    }
    async newComment(postId, req, params, comment) {
        const ip = params.visitors.ip;
        const commentInput = new entity_1.CommentEntity(Object.assign({ user: {
                id: req.user.id,
            }, post: {
                id: postId,
            }, ip }, comment));
        const data = await this.commentService.create(commentInput);
        return data;
    }
    async one(id) {
        const post = await this.postService.findById(id);
        let data;
        data = await this.decoratorTerms(post);
        switch (post.type) {
            case 'page': {
                data = await this.decoratorIsPage(data);
                break;
            }
            case 'post_format': {
                data = await this.formatData(data);
                break;
            }
            default:
                break;
        }
        data = await this.dealBlock(data);
        data = await this.decoratorSingleData(data);
        Reflect.deleteProperty(data, 'meta');
        return data;
    }
    async decoratorSingleData(data) {
        data = utils_1.formatOneMeta(data);
        return await this._formatOneData(data);
    }
    async dealDataList(list) {
        utils_1.formatAllMeta(list);
        for (const item of list) {
            await this._formatOneData(item);
        }
        return list;
    }
    async _formatOneData(item) {
        if (_.has(item.meta, '_items')) {
            item.blockStatus = item.meta._items;
        }
        let result = Object.assign({}, item);
        result.url = '';
        if (!Object.is(result.meta._audio_id, undefined)) {
            result.url = await this.attachmentService.getAttachment(result.meta._audio_id);
        }
        result.authorInfo = await this.userService.getDetailById(result.author);
        utils_1.formatOneMeta(result.authorInfo);
        if (_.has(result.authorInfo, 'meta')) {
            if (_.has(result.authorInfo.meta, 'avatar')) {
                result.authorInfo.avatarUrl = await this.attachmentService.getAttachment(result.authorInfo.meta.avatar);
            }
            if (!Object.is(result.authorInfo.meta[`_wechat`], undefined)) {
                result.authorInfo.avatarUrl = result.authorInfo.meta[`_wechat`].avatarUrl;
            }
            if (_.has(result.authorInfo.meta, 'resume')) {
                result.authorInfo.resume = result.authorInfo.meta.resume;
            }
            Reflect.deleteProperty(result.authorInfo, 'meta');
        }
        if (_.has(result.authorInfo, 'liked')) {
            Reflect.deleteProperty(result.authorInfo, 'liked');
        }
        result.likeCount = await this.postService.countByBehavior(common_types_1.EUserPostsBehavior.LIKE, result.id);
        result.viewCount = await this.postService.countByBehavior(common_types_1.EUserPostsBehavior.VIEW, result.id);
        if (_.has(result.meta, '_thumbnail_id')) {
            const featured_image = await this.attachmentService.getAttachment(result.meta._thumbnail_id);
            result = Object.assign(result, { featured_image });
        }
        item = Object.assign(item, result);
        Reflect.deleteProperty(item, 'meta');
        return item;
    }
    async decoratorTerms(post) {
        const data = {};
        data.categories = _.map(await this.categoriesService.findCategoriesByObject(post.id), 'taxonomyId');
        const postTermFormat = await this.categoriesService.formatTermForObject(post.id);
        if (postTermFormat && !_.isEmpty(postTermFormat)) {
            post.type = postTermFormat.slug;
        }
        return Object.assign({}, post, entity_1.PostEntity);
    }
    async decoratorTags(data) {
        data.tags = await this.categoriesService.getTagsByObject(data.id);
    }
    async dealBlock(post) {
        if (!_.isEmpty(post.block)) {
            const blockList = await this.postService.loadBLock(post.block);
            post.block = blockList;
        }
        return post;
    }
    async formatData(post) {
        return await this.postService.getFormatData(post);
    }
    async decoratorIsPage(post) {
        const options = await this.optionService.load();
        const stickys = options.stickys;
        const isSticky = _.find(stickys.default, id => {
            return post.id === id;
        });
        let data;
        if (isSticky) {
            data = Object.assign({}, post, {
                isSticky: true,
            });
        }
        else {
            data = Object.assign({}, post, {
                isSticky: false,
            });
        }
        return data;
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Query('page')), __param(1, common_1.Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "index", null);
__decorate([
    common_1.Get('categories/:category'),
    http_decorator_1.HttpProcessor.handle('获取类别下的内容'),
    __param(0, common_1.Req()),
    __param(1, common_1.Param('category')),
    __param(2, common_1.Query('page')), __param(3, common_1.Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "findByCategory", null);
__decorate([
    common_1.Get(':id/views'),
    http_decorator_1.HttpProcessor.handle('获取单个内容数据'),
    __param(0, common_1.Param('id')), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getViews", null);
__decorate([
    common_1.Post(':id/views/new'),
    __param(0, common_1.Param('id')), __param(1, common_1.Req()), __param(2, query_params_decorator_1.QueryParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "newViewer", null);
__decorate([
    common_1.Get(':id/comments'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Req()),
    __param(2, common_1.Query('page')),
    __param(3, common_1.Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getComments", null);
__decorate([
    common_1.Post(':id/comments/new'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Req()),
    __param(2, query_params_decorator_1.QueryParams()),
    __param(3, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, entity_1.CommentEntity]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "newComment", null);
__decorate([
    common_1.Get(':id'),
    http_decorator_1.HttpProcessor.handle('获取单个内容数据'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "one", null);
PostController = __decorate([
    common_1.Controller('posts'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [service_1.UserService,
        service_1.PostService,
        service_1.OptionService,
        service_1.CategoriesService,
        service_1.AttachmentService,
        service_1.CommentService])
], PostController);
exports.PostController = PostController;
//# sourceMappingURL=post.controller.js.map