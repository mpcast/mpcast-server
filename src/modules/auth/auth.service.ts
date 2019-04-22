/**
 * Auth service.
 * @file 权限与管理员模块服务
 * @module module/auth/service
 */

// import * as lodash from 'lodash';
// import * as APP_CONFIG from '@app/app.config';
import { Base64 } from 'js-base64';
// import { createHash } from 'crypto';
// import {InjectModel} from 'nestjs-typegoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import {TMongooseModel} from '@app/interfaces/mongoose.interface';
// import {Auth} from './auth.model';
import { PasswordCiper } from '@app/service/helpers/password-cipher/password-ciper';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ID } from '@app/common/shared-types';
import { User } from '@app/entity';
// import { ValidationError } from '@app/errors/validation.error';
import { HttpUnauthorizedError } from '@app/errors/unauthorized.error';

@Injectable()
export class AuthService {
  private readonly sessionDurationInMs: number;

  constructor(
    @InjectConnection() private connection: Connection,
    private passwordCipher: PasswordCiper,
    private readonly jwtService: JwtService,
    // @InjectModel(Auth) private readonly authModel: TMongooseModel<Auth>,
  ) {
  }

  // 验证 Auth 数据
  async validateAuthData(payload: any): Promise<any> {
    // const isVerified = lodash.isEqual(payload.data, APP_CONFIG.AUTH.data);
    // IF 是微信，返回唯一标识，一般为用户的 openid
    if (payload.type === 'wechat') {
      const user = await this.connection.getRepository(User).findOne({
        identifier: payload.identifier,
      });
      if (user) {
        return payload.identifier;
      }
      return null;
    }
    // IF 是注册会员
    // WIP
  }

  /**
   * 根据给定用户的密码验证所提供的密码
   * @param userId
   * @param password
   */
  async verifyUserPassword(userId: ID, password: string): Promise<boolean> {
    const user = await this.connection.getRepository(User).findOne(userId, {
      select: ['passwordHash'],
    });
    if (!user) {
      throw new HttpUnauthorizedError();
    }
    const passwordMathces = await this.passwordCipher.check(password, user.passwordHash);
    if (!passwordMathces) {
      throw new HttpUnauthorizedError();
    }
    return true;
  }

  // 密码编码
  // private decodeBase64(password) {
  //     return password ? Base64.decode(password) : password;
  // }

  // md5 编码
  // private decodeMd5(password) {
  //     return createHash('md5').update(password).digest('hex');
  // }

  // 验证 Auth 数据
  // public validateAuthData(payload: any): Promise<any> {
  //     const isVerified = lodash.isEqual(payload.data, APP_CONFIG.AUTH.data);
  //     return isVerified ? payload.data : null;
  // }

  // 获取管理员信息
  // public getAdminInfo(): Promise<Auth> {
  //     return this.authModel.findOne(null, '-_id name slogan gravatar').exec();
  // }

  /*    // 修改管理员信息
      public putAdminInfo(auth: Auth): Promise<Auth> {

          // 密码解码
          const password = this.decodeBase64(auth.password);
          const new_password = this.decodeBase64(auth.new_password);
          const rel_new_password = this.decodeBase64(auth.rel_new_password);

          return new Promise((resolve, reject) => {
              // 验证密码
              if (password || new_password || rel_new_password) {
                  const isLackConfirmPassword = !new_password || !rel_new_password;
                  const isDissimilarityConfirmPassword = new_password !== rel_new_password;
                  const isIncludeOldPassword = [new_password, rel_new_password].includes(password);
                  // 判定密码逻辑
                  if (isLackConfirmPassword || isDissimilarityConfirmPassword) {
                      return reject('密码不一致或无效');
                  }
                  if (isIncludeOldPassword) {
                      return reject('新旧密码不可一致');
                  }
              }
              return resolve();
          }).then(_ => {

              // 修改前查询验证
              // return this.authModel.findOne().exec();
          }).then(extantAuth => {

              // 核对已存在密码
              const isExistedAuth = extantAuth && !!extantAuth._id;
              const extantAuthPwd = extantAuth && extantAuth.password;
              const extantPassword = extantAuthPwd || this.decodeMd5(APP_CONFIG.AUTH.defaultPassword);

              // 修改密码 -> 判断旧密码是否一致
              if (password) {
                  if (extantPassword !== this.decodeMd5(password)) {
                      return Promise.reject('原密码不正确');
                  } else {
                      auth.password = this.decodeMd5(rel_new_password);
                      Reflect.deleteProperty(auth, 'new_password');
                      Reflect.deleteProperty(auth, 'rel_new_password');
                  }
              }

              // 新建数据或保存已有
              return isExistedAuth
                  ? Object.assign(extantAuth, auth).save()
                  : new this.authModel(auth).save();
          });
      }

      // 登陆/创建 Token
      public createToken(password: string): Promise<ITokenResult> {
          return this.authModel.findOne(null, 'password').exec().then(auth => {
              const extantAuthPwd = auth && auth.password;
              const extantPassword = extantAuthPwd || this.decodeMd5(APP_CONFIG.AUTH.defaultPassword);
              const submittedPassword = this.decodeMd5(this.decodeBase64(password));
              if (submittedPassword === extantPassword) {
                  const access_token = this.jwtService.sign({data: APP_CONFIG.AUTH.data});
                  return Promise.resolve({access_token, expires_in: APP_CONFIG.AUTH.expiresIn});
              } else {
                  return Promise.reject('密码不匹配');
              }
          });
      }*/
}
