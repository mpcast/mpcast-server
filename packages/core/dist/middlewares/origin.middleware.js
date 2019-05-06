"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const app_config_1 = require("../app.config");
const app_environment_1 = require("../app.environment");
const TEXT = __importStar(require("../common/constants/text.constant"));
const http_interface_1 = require("../common/types/interfaces/http.interface");
let OriginMiddleware = class OriginMiddleware {
    use(request, response, next) {
        if (app_environment_1.isProdMode) {
            const { origin, referer } = request.headers;
            const checkHeader = (field) => !field || field.includes(app_config_1.CROSS_DOMAIN.allowedReferer);
            const isVerifiedOrigin = checkHeader(origin);
            const isVerifiedReferer = checkHeader(referer);
            if (!isVerifiedOrigin && !isVerifiedReferer) {
                return response.status(common_1.HttpStatus.UNAUTHORIZED).jsonp({
                    status: http_interface_1.EHttpStatus.Error,
                    message: TEXT.HTTP_ANONYMOUSE_TEXT,
                    error: null,
                });
            }
        }
        return next();
    }
};
OriginMiddleware = __decorate([
    common_1.Injectable()
], OriginMiddleware);
exports.OriginMiddleware = OriginMiddleware;
//# sourceMappingURL=origin.middleware.js.map