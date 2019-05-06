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
const TEXT = __importStar(require("../constants/text.constant"));
class ValidationError extends common_1.HttpException {
    constructor(error) {
        super(error || TEXT.VALIDATION_ERROR_DEFAULT, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=validation.error.js.map