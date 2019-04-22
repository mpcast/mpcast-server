import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as APP_CONFIG from '@app/app.config';
import { AuthController } from '@app/modules/auth/auth.controller';
import { AuthService } from '@app/modules/auth/auth.service';
import { JwtStrategy } from '@app/modules/auth/jwt.strategy';
import { PasswordCiper } from '@app/service/helpers/password-cipher/password-ciper';

@Module({
  imports: [
    // TypeOrmModule.forFeature([
    // ])
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secretOrPrivateKey: APP_CONFIG.AUTH.jwtTokenSecret,
      signOptions: { expiresIn: APP_CONFIG.AUTH.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [PasswordCiper, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
