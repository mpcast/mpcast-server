/* eslint-disable no-undef,no-return-await */
// const Redis = require('ioredis')
// const redis = new Redis()
const jwt = require('jsonwebtoken')
module.exports = class extends think.Controller {

  async getAction () {
    const action = this.get('action')
    switch (action) {
      case 'subdomain_validation': {
        const subdomain = this.get('subdomain')
        return this.subdomainValidation(subdomain)
      }
      case 'shortid' : {
        return this.success(think.id.generate())
      }
      default: {
        break
      }
    }
  }

  async postAction () {
    const action = this.get('action')
    const type = this.post('type')
    const data = this.post()

    switch (action) {
      case 'request_code': {
        if (type === 'create-org' && think.isEmpty(data.code)) {
          return await this._requestCode(data.identity)
        }
        break
      }
      case 'verify_code': {
        if (type === 'create-org' && !think.isEmpty(data.code)) {
          return await this._verifyCode(data.identity, data.code)
        }
        break
      }
      case 'signin': {
        return await this.signin()
      }
      case 'logout': {
        return await this.logout()
      }
      default: {
        break
      }
    }

  }

  /**
   * 校验短信验证码
   * @param identity
   * @param code
   * @returns {Promise.<*>}
   */
  async _verifyCode (identity, code) {
    const verify = await verifyMsgCode(identity, code)
    if (verify) {
      return this.success()
    } else {
      return this.fail('校验失败！')
    }
  }

  /**
   * 生成短信验证码
   * @param identity
   * @returns {Promise.<*>}
   */
  async _requestCode (identity) {
    const signName = think.config('options.sms.sign.value')
    // 发送短信验证码
    const code = Random()
    const SMS = think.service('sms', 'common');
    const msg = {
      PhoneNumbers: identity,
      SignName: signName,
      TemplateCode: think.config('options.sms.template.value'),
      TemplateParam: `{"code":"${code}","product":"${think.config('options.sms.product.value')}"}`
    }
    const res = await SMS.send(msg);
    // console.log(res)
    if (res.Code !== 'OK') {
      think.logger.error(res)
      return this.fail('发送失败，请重试！')
    }
    // 添加至 REDIS 服务
    await think.cache(identity, code, 'EX', 360);
    await this.cache(identity, code, {
      type: 'redis',
      redis: {
        timeout: 360
      }
    });
    return this.success()
  }

  /**
   * 验证机构名称 用于二级域名
   * @param subdomain
   * @returns {Promise.<*>}
   */
  // api/teams/subdomain_validation?subdomain=vanq
  async subdomainValidation (subdomain) {
    const orgs = await think.cache('orgs')
    const validation = await think._.has(orgs, subdomain)
    if (!validation) {
      return this.success()
    } else {
      return this.fail('名称已存在！')
    }
  }

  /**
   * 登录
   * @returns {Promise.<*>}
   */
  async signin () {
    const orgId = this.get('orgId')
    const data = this.post()
    const userLogin = data.user_login;
    const userModel = this.model('users');
    const userInfo = await userModel.where({user_login: userLogin}).find();
    // 验证用户是否存在
    if (think.isEmpty(userInfo)) {
      return this.fail('ACCOUNT_ERROR');
    }
    // 验证机构中是否存在此用户并处理用户角色权限
    _formatOneMeta(userInfo)
    if (!think.isEmpty(userInfo.meta.avatar)) {
      userInfo.avatar = await this.model('postmeta').getAttachment('file', userInfo.meta.avatar)
    }
    if (!Object.is(userInfo.meta[`org_${orgId}_capabilities`], undefined)) {
      userInfo.role = JSON.parse(userInfo.meta[`org_${orgId}_capabilities`]).role
    } else {
      return this.fail('ACCOUNT_FORBIDDEN');
    }
    // if (Object.is(userInfo.meta.avatar))

    // 帐号是否被禁用，且投稿者不允许登录
    if ((userInfo.user_status | 0) !== 1 || userInfo.deleted === 1) {
      return this.fail('ACCOUNT_FORBIDDEN');
    }

    // 校验密码
    const password = data.user_pass;
    if (!userModel.checkPassword(userInfo, password)) {
      return this.fail('ACCOUNT_ERROR');
    }
    // 获取签名盐
    const token = jwt.sign(userInfo, 'S1BNbRp2b', {expiresIn: '3d'})
    // user: userInfo.user_login,
    // let validity_days = 7;
    // let expires = validity_days * 1000 * 60 * 60 * 24;
    return this.success({user: userInfo.user_login, token: {value: token, expires: 3}});
    // }
  }
  /**
   * @return {}
   */
  async logout () {
    console.log('logout....')
    return this.success('logout ...')
    // await this.session('userInfo', '');
    // return this.redirect('/');
  }
}
