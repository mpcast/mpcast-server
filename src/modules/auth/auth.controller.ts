import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { QueryParams } from '@app/decorators/query-params.decorator';
import { ITokenResult } from '@app/modules/auth/auth.interface';
import { AuthLogin } from '@app/modules/auth/auth.entity';

@Controller('auth')
export class AuthController {
  constructor() {
  }

  @Post('login')
  @HttpProcessor.handle({ message: '登陆', error: HttpStatus.BAD_REQUEST })
  createToken(@QueryParams() { visitors: { ip } }, @Body() body: AuthLogin): Promise<ITokenResult> {
    // return this.authService.createToken(body.password).then(token => {
    // this.ipService.query(ip).then(ipLocation => {
    //   const subject = '博客有新的登陆行为';
    //   const content = `来源 IP：${ip}，地理位置为：${ipLocation.country}-${ipLocation.city}`;
    //   this.emailService.sendMail({
    //     subject,
    //     to: APP_CONFIG.EMAIL.admin,
    //     text: `${subject}，${content}`,
    //     html: `${subject}，${content}`,
    //   });
    // });
    // return token;
    // });
    // return <ITokenResult> {
    //   accessToken: '';
    // expiresIn: 10;
    // }
    return Promise.resolve({
      accessToken: 'abcd1234',
      expiresIn: 10,
    });
  }

  @Post('check')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('检测 Token')
  checkToken(): string {
    return 'ok';
  }
}
