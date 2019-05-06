"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const lodash = __importStar(require("lodash"));
const mongoose_1 = require("mongoose");
const bad_request_error_1 = require("../common/errors/bad-request.error");
const forbidden_error_1 = require("../common/errors/forbidden.error");
const state_interface_1 = require("../common/types/interfaces/state.interface");
var EQueryParamsField;
(function (EQueryParamsField) {
    EQueryParamsField["Page"] = "page";
    EQueryParamsField["PerPage"] = "per_page";
    EQueryParamsField["Sort"] = "sort";
    EQueryParamsField["Date"] = "date";
    EQueryParamsField["Keyword"] = "keyword";
    EQueryParamsField["State"] = "state";
    EQueryParamsField["Public"] = "public";
    EQueryParamsField["Origin"] = "origin";
    EQueryParamsField["ParamsId"] = "paramsId";
    EQueryParamsField["CommentState"] = "commentState";
})(EQueryParamsField = exports.EQueryParamsField || (exports.EQueryParamsField = {}));
exports.QueryParams = common_1.createParamDecorator((customConfig, request) => {
    const isAuthenticated = request.isAuthenticated();
    const transformConfig = {
        [EQueryParamsField.Page]: 1,
        [EQueryParamsField.PerPage]: true,
        [EQueryParamsField.ParamsId]: 'id',
        [EQueryParamsField.Sort]: true,
    };
    if (customConfig) {
        customConfig.forEach(field => {
            if (lodash.isString(field)) {
                transformConfig[field] = true;
            }
            if (lodash.isObject(field)) {
                Object.assign(transformConfig, field);
            }
        });
    }
    const querys = {};
    const options = {};
    const params = lodash.merge({ url: request.url }, request.params);
    const date = request.query.date;
    const paramsId = request.params[transformConfig.paramsId];
    const [page, per_page, sort, state, ppublic, origin] = [
        request.query.page || transformConfig.page,
        request.query.per_page,
        request.query.sort,
        request.query.state,
        request.query.public,
        request.query.origin,
    ].map(item => item != null ? Number(item) : item);
    const validates = [
        {
            name: '路由/ID',
            field: EQueryParamsField.ParamsId,
            isAllowed: true,
            isIllegal: paramsId != null && !isAuthenticated && isNaN(paramsId),
            setValue() {
                if (paramsId != null) {
                    params[transformConfig.paramsId] = isNaN(paramsId)
                        ? mongoose_1.Types.ObjectId(paramsId)
                        : Number(paramsId);
                }
            },
        },
        {
            name: '排序/sort',
            field: EQueryParamsField.Sort,
            isAllowed: lodash.isUndefined(sort) || [state_interface_1.ESortType.Asc, state_interface_1.ESortType.Desc, state_interface_1.ESortType.Hot].includes(sort),
            isIllegal: false,
            setValue() {
                options.sort = {
                    _id: sort != null
                        ? sort
                        : state_interface_1.ESortType.Desc,
                };
            },
        },
        {
            name: '目标页/page',
            field: EQueryParamsField.Page,
            isAllowed: lodash.isUndefined(page) || (lodash.isInteger(page) && Number(page) > 0),
            isIllegal: false,
            setValue() {
                if (page != null) {
                    options.page = page;
                }
            },
        },
        {
            name: '每页数量/per_page',
            field: EQueryParamsField.PerPage,
            isAllowed: lodash.isUndefined(per_page) || (lodash.isInteger(per_page) && Number(per_page) > 0),
            isIllegal: false,
            setValue() {
                if (per_page != null) {
                    options.limit = per_page;
                }
            },
        },
        {
            name: '日期查询/date',
            field: EQueryParamsField.Date,
            isAllowed: lodash.isUndefined(date) || new Date(date).toString() !== 'Invalid Date',
            isIllegal: false,
            setValue() {
                if (date != null) {
                    const queryDate = new Date(date);
                    querys.create_at = {
                        $gte: new Date((queryDate / 1000 - 60 * 60 * 8) * 1000),
                        $lt: new Date((queryDate / 1000 + 60 * 60 * 16) * 1000),
                    };
                }
            },
        },
        {
            name: '发布状态/state',
            field: EQueryParamsField.State,
            isAllowed: lodash.isUndefined(state) ||
                (transformConfig[EQueryParamsField.CommentState]
                    ? [state_interface_1.ECommentState.Auditing, state_interface_1.ECommentState.Deleted, state_interface_1.ECommentState.Published, state_interface_1.ECommentState.Spam].includes(state)
                    : [state_interface_1.EPublishState.Published, state_interface_1.EPublishState.Draft, state_interface_1.EPublishState.Recycle].includes(state)),
            isIllegal: !isAuthenticated &&
                state != null &&
                state !== (transformConfig[EQueryParamsField.CommentState]
                    ? state_interface_1.ECommentState.Published
                    : state_interface_1.EPublishState.Published),
            setValue() {
                if (state != null) {
                    querys.state = state;
                    return false;
                }
                if (!isAuthenticated) {
                    querys.state = transformConfig[EQueryParamsField.CommentState]
                        ? state_interface_1.ECommentState.Published
                        : state_interface_1.EPublishState.Published;
                }
            },
        },
        {
            name: '公开状态/public',
            field: EQueryParamsField.Public,
            isAllowed: lodash.isUndefined(ppublic) || [state_interface_1.EPublicState.Public, state_interface_1.EPublicState.Password, state_interface_1.EPublicState.Secret].includes(ppublic),
            isIllegal: ppublic != null && !isAuthenticated && ppublic !== state_interface_1.EPublicState.Public,
            setValue() {
                if (ppublic != null) {
                    querys.public = ppublic;
                    return false;
                }
                if (!isAuthenticated) {
                    querys.public = state_interface_1.EPublicState.Public;
                }
            },
        },
        {
            name: '来源状态/origin',
            field: EQueryParamsField.Origin,
            isAllowed: lodash.isUndefined(origin) || [state_interface_1.EOriginState.Original, state_interface_1.EOriginState.Hybrid, state_interface_1.EOriginState.Reprint].includes(origin),
            isIllegal: false,
            setValue() {
                if (origin != null) {
                    querys.origin = origin;
                }
            },
        },
    ];
    const isEnableField = (field) => field != null && field !== false;
    validates.forEach(validate => {
        if (!isEnableField(transformConfig[validate.field])) {
            return false;
        }
        if (!validate.isAllowed) {
            throw new bad_request_error_1.HttpBadRequestError('参数不合法：' + validate.name);
        }
        if (validate.isIllegal) {
            throw new forbidden_error_1.HttpForbiddenError('权限与参数匹配不合法：' + validate.name);
        }
        validate.setValue();
    });
    const isProcessedFields = validates.map(validate => validate.field);
    const allAllowFields = Object.keys(transformConfig);
    const todoFields = lodash.difference(allAllowFields, isProcessedFields);
    todoFields.forEach(field => {
        const targetValue = request.query[field];
        if (targetValue != null) {
            querys[field] = targetValue;
        }
    });
    request.queryParams = { querys, options, params, isAuthenticated };
    const ip = (request.headers['x-forwarded-for'] ||
        request.headers['x-real-ip'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress ||
        request.ip ||
        request.ips[0]).replace('::ffff:', '');
    const ua = request.headers['user-agent'];
    const result = {
        querys,
        options,
        params,
        request,
        origin: request.query,
        visitors: { ip, ua, referer: request.referer },
        isAuthenticated,
    };
    return result;
});
//# sourceMappingURL=query-params.decorator.js.map