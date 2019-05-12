import { Body, Controller, Get, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';

import { Permission } from '../../../common/generated-types';
import { ITokenResult } from '../../../common/types/common-types';
import { Logger } from '../../../config';
import { HttpProcessor } from '../../../decorators/http.decorator';
import { IQueryParamsResult, QueryParams } from '../../../decorators/query-params.decorator';
import { AuthService } from '../../../service';
import { Allow } from '../../decorators/allow.decorator';
import { AuthLogin } from '../../dtos/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @Post('login')
    @HttpProcessor.handle({ message: '登陆', error: HttpStatus.BAD_REQUEST })
    @Allow(Permission.Public)
    createToken(@QueryParams() { visitors: { ip } }: IQueryParamsResult, @Body() body: AuthLogin): Promise<ITokenResult> {
        return this.authService.authenticate(body.identifier, body.password).then(token => {
            // 其它数据业务处理
            console.log(token);
            return token;
        });
    }

    /**
     * 授权后的用户信息
     */
    @Get('user')
    @HttpProcessor.handle({ message: '权限用户信息获取', error: HttpStatus.BAD_REQUEST })
    @Allow(Permission.Owner)
    getUser(@Req() req: any) {
        return this.authService.getUserFromIdentifier(req.user.identifier);
    }

    @Post('check')
    @Allow(Permission.Owner)
    // @HttpProcessor.handle('检测 Token')
    checkToken(): string {
        return 'ok';
    }
}
