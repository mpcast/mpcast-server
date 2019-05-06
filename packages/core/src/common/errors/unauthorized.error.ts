import { UnauthorizedException } from '@nestjs/common';

import * as TEXT from '../constants/text.constant';
import { TMessage } from '../types/interfaces/http.interface';

/**
 * @class HttpUnauthorizedError
 * @classdesc 401 -> 未授权/权限验证失败
 * @example new HttpUnauthorizedError('验证失败')
 * @example new HttpUnauthorizedError('错误信息', new Error())
 */
export class HttpUnauthorizedError extends UnauthorizedException {
    constructor(message?: TMessage, error?: any) {
        super(message || TEXT.HTTP_UNAUTHORIZED_TEXT_DEFAULT, error);
    }
}
