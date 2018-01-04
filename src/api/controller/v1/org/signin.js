/* eslint-disable no-undef */
// import speakeasy from 'speakeasy';
const jwt = require('jsonwebtoken')

module.exports = class extends think.Controller {

  async postAction () {
    const orgId = this.get('orgId')
    const data = this.post()
    const userLogin = data.user_login;
    const userModel = this.model('users');
    const userInfo = await userModel.where({user_login: userLogin}).find();
    // 验证用户是否存在
    if (think.isEmpty(userInfo)) {
      return this.fail(400, '账户不存在');
    }
    // 验证机构中是否存在此用户并处理用户角色权限
    _formatOneMeta(userInfo)
    if (!think.isEmpty(userInfo.meta.avatar)) {
      userInfo.avatar = await this.model('postmeta').getAttachment('file', userInfo.meta.avatar)
    }
    if (!Object.is(userInfo.meta[`org_${orgId}_capabilities`], undefined)) {
      userInfo.role = JSON.parse(userInfo.meta[`org_${orgId}_capabilities`]).role
    } else {
      return this.fail(401, 'ACCOUNT_FORBIDDEN');
    }
    // if (Object.is(userInfo.meta.avatar))

    // 帐号是否被禁用，且投稿者不允许登录
    if ((userInfo.user_status | 0) !== 1 || userInfo.deleted === 1) {
      return this.fail(401, 'ACCOUNT_FORBIDDEN');
    }

    // 校验密码
    const password = data.user_pass;
    if (!userModel.checkPassword(userInfo, password)) {
      return this.fail(400, '密码错误');
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
   * login
   * @return {} []
   */
  async _loginAction () {
    // 二步验证
    // let model = this.model('options');
    // let options = await model.getOptions();
    // if(options.two_factor_auth){
    //     let two_factor_auth = this.post('two_factor_auth');
    //     let verified = speakeasy.totp.verify({
    //         secret: options.two_factor_auth,
    //         encoding: 'base32',
    //         token: two_factor_auth,
    //         window: 2
    //     });
    //     if(!verified){
    //         return this.fail('TWO_FACTOR_AUTH_ERROR');
    //     }
    // }

    // 校验帐号和密码
    const username = this.post('username');
    const userModel = this.model('users');
    const userInfo = await userModel.where({name: username}).find();
    if (think.isEmpty(userInfo)) {
      return this.fail('ACCOUNT_ERROR');
    }

    // 帐号是否被禁用，且投稿者不允许登录
    if ((userInfo.status | 0) !== 1 || userInfo.type === 3) {
      return this.fail('ACCOUNT_FORBIDDEN');
    }

    // 校验密码
    const password = this.post('password');
    if (!userModel.checkPassword(userInfo, password)) {
      return this.fail('ACCOUNT_ERROR');
    }

    await this.session('userInfo', userInfo);

    return this.success();
  }

  /**
   * logout
   * @return {}
   */
  async logoutAction () {
    await this.session('userInfo', '');
    return this.redirect('/');
  }

  /**
   * update user password
   */
  async passwordAction () {
    const userInfo = await this.session('userInfo') || {};
    if (think.isEmpty(userInfo)) {
      return this.fail('USER_NOT_LOGIN');
    }

    const rows = await this.model('user').saveUser({
      password: this.post('password'),
      id: userInfo.id
    }, this.ip());

    return this.success(rows);
  }
}
