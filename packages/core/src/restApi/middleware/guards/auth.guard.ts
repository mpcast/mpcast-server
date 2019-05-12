import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { HttpUnauthorizedError } from '../../../common/errors/unauthorized.error';
import { Permission } from '../../../common/generated-types';
import { PERMISSIONS_METADATA_KEY } from '../../decorators/allow.decorator';

/**
 * @class JwtAuthGuard
 * @classdesc 检验规则：Token 是否存在 -> Token 是否在有效期内 -> Token 解析出的数据是否对的上
 * @example @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // console.log('canActivate ' + JSON.stringify(context));
        const permissions = this.reflector.get<Permission[]>(PERMISSIONS_METADATA_KEY, context.getHandler());
        const isPublic = !!permissions && permissions.includes(Permission.Public);
        const hasOwnerPermission = !!permissions && permissions.includes(Permission.Owner);
        // console.log(hasOwnerPermission);
        if (!permissions || isPublic) {
            console.log('没设置权限')
            return true;
        } else {
            return super.canActivate(context);
        }
    }

    /**
     * @function handleRequest
     * @description 如果解析出的数据对不上，则判定为无效
     */
    // handleRequest<TUser = any>(err: any, user: any, info: any): TUser;
    handleRequest(error: any, user: any, errInfo: any) {
        if (user && !error && !errInfo) {
            return user;
        } else {
            throw error ||
            new HttpUnauthorizedError(
                undefined,
                errInfo && errInfo.message,
            );
        }
    }
}
