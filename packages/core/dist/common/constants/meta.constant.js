"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants = __importStar(require("@nestjs/common/constants"));
const cache_constants_1 = require("@nestjs/common/cache/cache.constants");
exports.HTTP_ERROR_CODE = '__customHttpErrorCode__';
exports.HTTP_SUCCESS_CODE = constants.HTTP_CODE_METADATA;
exports.HTTP_MESSAGE = '__customHttpMessage__';
exports.HTTP_ERROR_MESSAGE = '__customHttpErrorMessage__';
exports.HTTP_SUCCESS_MESSAGE = '__customHttpSuccessMessage__';
exports.HTTP_RES_TRANSFORM_PAGINATE = '__customHttpResTransformPagenate__';
exports.HTTP_CACHE_KEY_METADATA = cache_constants_1.CACHE_KEY_METADATA;
exports.HTTP_CACHE_TTL_METADATA = '__customHttpCacheTTL__';
//# sourceMappingURL=meta.constant.js.map