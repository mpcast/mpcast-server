/**
 * HumanizedJwtAuth guard.
 * @file 智能鉴权卫士
 * @module guard/humanized-auth
 */

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { HttpUnauthorizedError } from '../../../common/errors/unauthorized.error';

/**
 * @class HumanizedJwtAuthGuard
 * @classdesc 检验规则：Token 不存在 | Token 存在且有效
 * @example @UseGuards(HumanizedJwtAuthGuard)
 */
@Injectable()
export class HumanizedJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  /**
   * @function handleRequest
   * @description 如果 Token 不存在或 Token 存在并有效，都是通行
   */
  handleRequest(error: any, authInfo: any, errInfo: any) {
    const okToken = !!authInfo;
    const noToken = !authInfo && errInfo && errInfo.message === 'No auth token';
    if (!error && (okToken || noToken)) {
      return authInfo;
    } else {
      throw error || new HttpUnauthorizedError(undefined, errInfo && errInfo.message);
    }
  }
}
