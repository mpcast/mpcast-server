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
const META = __importStar(require("../common/constants/meta.constant"));
const TEXT = __importStar(require("../common/constants/text.constant"));
const buildHttpDecorator = (options) => {
    const { errMessage, successMessage, errCode, successCode, usePaginate } = options;
    return (_, __, descriptor) => {
        if (errCode) {
            common_1.ReflectMetadata(META.HTTP_ERROR_CODE, errCode)(descriptor.value);
        }
        if (successCode) {
            common_1.ReflectMetadata(META.HTTP_SUCCESS_CODE, successCode)(descriptor.value);
        }
        if (errMessage) {
            common_1.ReflectMetadata(META.HTTP_ERROR_MESSAGE, errMessage)(descriptor.value);
        }
        if (successMessage) {
            common_1.ReflectMetadata(META.HTTP_SUCCESS_MESSAGE, successMessage)(descriptor.value);
        }
        if (usePaginate) {
            common_1.ReflectMetadata(META.HTTP_RES_TRANSFORM_PAGINATE, true)(descriptor.value);
        }
        return descriptor;
    };
};
exports.error = (message, statusCode) => {
    return buildHttpDecorator({ errMessage: message, errCode: statusCode });
};
exports.success = (message, statusCode) => {
    return buildHttpDecorator({ successMessage: message, successCode: statusCode });
};
function handle(...args) {
    const option = args[0];
    const isOption = (value) => lodash.isObject(value);
    const message = isOption(option) ? option.message : '';
    const errMessage = message + TEXT.HTTP_ERROR_SUFFIX;
    const successMessage = message + TEXT.HTTP_SUCCESS_SUFFIX;
    const errCode = isOption(option) ? option.error : common_1.HttpStatus.NOT_FOUND;
    const successCode = isOption(option) ? option.success : common_1.HttpStatus.NOT_FOUND;
    const usePaginate = isOption(option) ? option.usePaginate : false;
    return buildHttpDecorator({ errCode, successCode, errMessage, successMessage, usePaginate });
}
exports.handle = handle;
exports.paginate = () => {
    return buildHttpDecorator({ usePaginate: true });
};
exports.HttpProcessor = { error: exports.error, success: exports.success, handle, paginate: exports.paginate };
//# sourceMappingURL=http.decorator.js.map