import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { QueryParams } from '@app/decorators/query-params.decorator';
import { ITokenResult } from '@app/modules/auth/auth.interface';
import { AuthLogin } from '@app/modules/auth/auth.entity';
// import * as APP_CONFIG from '@app/app.config';
import { AuthService } from '@app/modules/auth/auth.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Post('login')
  @HttpProcessor.handle({ message: '登陆', error: HttpStatus.BAD_REQUEST })
  createToken(@QueryParams() { visitors: { ip } }, @Body() body: AuthLogin): Promise<ITokenResult> {
    return this.authService.authenticate(body.identifier, body.password).then(token => {
      // 其它数据业务处理
      console.log(token);
      return token;
    });
  }

  @Post('check')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('检测 Token')
  checkToken(): string {
    return 'ok';
  }
}
