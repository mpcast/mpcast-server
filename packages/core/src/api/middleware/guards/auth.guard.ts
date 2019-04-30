import { HttpUnauthorizedError } from '../../../common/errors/unauthorized.error';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @class JwtAuthGuard
 * @classdesc 检验规则：Token 是否存在 -> Token 是否在有效期内 -> Token 解析出的数据是否对的上
 * @example @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // console.log('canActivate ' + JSON.stringify(context));
    return super.canActivate(context);
  }
  /**
   * @function handleRequest
   * @description 如果解析出的数据对不上，则判定为无效
   */
  // handleRequest<TUser = any>(err: any, user: any, info: any): TUser;
  handleRequest(error, user, errInfo) {
    if (user && !error && !errInfo) {
      return user;
    } else {
      throw error || new HttpUnauthorizedError(null, errInfo && errInfo.message);
    }
  }
}
