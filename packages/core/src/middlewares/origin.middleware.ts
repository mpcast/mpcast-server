/**
 * Origin middleware.
 * @file Origin 中间件
 * @module middleware/origin
 */

import * as TEXT from '../common/constants/text.constant';
import { EHttpStatus, THttpErrorResponse } from '../common/types/interfaces/http.interface';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';

import { CROSS_DOMAIN } from '../app.config';
import { isProdMode } from '../app.environment';

/**
 * @class OriginMiddleware
 * @classdesc 用于验证是否为非法来源请求
 */
@Injectable()
export class OriginMiddleware implements NestMiddleware {
  use(request, response, next) {
    // 如果是生产环境，需要验证用户来源渠道，防止非正常请求
    if (isProdMode) {
      const { origin, referer } = request.headers;
      const checkHeader = field => !field || field.includes(CROSS_DOMAIN.allowedReferer);
      const isVerifiedOrigin = checkHeader(origin);
      const isVerifiedReferer = checkHeader(referer);
      if (!isVerifiedOrigin && !isVerifiedReferer) {
        return response.status(HttpStatus.UNAUTHORIZED).jsonp({
          status: EHttpStatus.Error,
          message: TEXT.HTTP_ANONYMOUSE_TEXT,
          error: null,
        } as THttpErrorResponse);
      }
    }

    // 其他通行
    return next();
  }
}
