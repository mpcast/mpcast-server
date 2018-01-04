/* eslint-disable no-return-await */
const BaseRest = require('./Base');
const jwt = require('jsonwebtoken')

module.exports = class extends BaseRest {
  async indexAction () {
    console.log(this.ctx.header)
    // const appsModel = this.model('apps')
    // const app = await appsModel.get(this.appId)
    // this.app.default = this.options.default
    // this.app.stickys = this.options.stickys
    Reflect.deleteProperty(this.options, 'wechat')
    Reflect.deleteProperty(this.options, 'upload')
    Reflect.deleteProperty(this.options, '_user_roles')
    Reflect.deleteProperty(this.options, 'default')
    Reflect.deleteProperty(this.options._wxapp, 'config')
    this.app.options = this.options._wxapp
    return this.success(this.app)
  }

  async postAction () {
    const action = this.get('action')
    const data = this.post()

    switch (action) {
      case 'create': {
        const orgId = data.org_id
        if (think.isEmpty(orgId)) {
          return this.fail('机构 ID 不能为空!')
        }
        const type = data.type
        return await this.installApp(orgId, type)
      }
      case 'wxlogin': {
        const xWechatCode = this.header('x-wechat-code')
        const encrypted = this.header('x-wechat-encrypted')
        const iv = this.header('x-wechat-iv')
        if (think.isEmpty(xWechatCode) || think.isEmpty(encrypted) || think.isEmpty(iv)) {
          return this.fail('登录协议处理错误!')
        }
        const token = await this.wxLogin(xWechatCode, encrypted, iv)
        return this.success({token: token});
      }
      default: {
        break
      }
    }
  }

  /**
   * 安装应用，初始化表与数据
   * @param orgId
   * @param type
   * @returns {Promise.<*>}
   */
  async installApp (orgId, type) {
    const appId = think.id.generate()
    // 应用数据表创建
    const db = think.service('installApp', 'common', {appId: appId})
    const res = await db.create()
    // 应用数据初始始化
    // 更新应用表信息
    if (think.isEmpty(res)) {
      const appsModel = this.model('apps')
      await appsModel.add({
        id: appId,
        org_id: orgId,
        create_time: new Date().getTime(),
        update_time: new Date().getTime(),
        public: 1,
        type: type
      })

      await this.model('appmeta').add({
        app_id: appId,
        meta_key: 'basic',
        meta_value: JSON.stringify({
          plan: 'basic'
        })
      })
      return this.success({appId: appId})
    } else {
      think.logger.error(res)
      return this.fail(res)
    }
  }

  /**
   * x-wechat-code : 微信登录的 code
   * x-wechat-encrypted : 微信登录后已加密的用户信息
   * x-wechat-iv: 解密向量
   *
   * @returns {Promise.<void>}
   */
  async wxLogin (code, encrypted, iv) {

    const data = this.post()
    const options = await this.model('options', {appId: this.appId}).get()
    const wxConfig = options.wechat
    if (!think.isEmpty(wxConfig)) {
      const wxService = think.service('wechat', 'common', wxConfig.appid, wxConfig.appsecret)
      /*
        "openId": "oQgDx0IVqAg0b3GibFYBdtg3BKMA",
        "nickName": "请好好说话🌱",
        "gender": 1,
        "language": "en",
        "city": "Chaoyang",
        "province": "Beijing",
        "country": "China",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep0GdQEHK3tYdvq3DTMVhsdiaviaLg6b7CdDBLOYSWDGYOEtS7FFmvhd6CGCuQVfe4Rb0uQUlaq7XoA/0",
        "watermark": {
            "timestamp": 1508409692,
            "appid": "wxca1f2b8b273d909e"
        }
      */
      let wxUserInfo = await wxService.getUserInfo(encrypted, iv, code)
      wxUserInfo = think.extend({}, wxUserInfo, {appId: this.appId})
      // console.log(JSON.stringify(wxUserInfo))
      // 验证用户或保存为新用户
      const userModel = this.model('users')
      const token = jwt.sign(wxUserInfo, 'S1BNbRp2b')
      await userModel.saveWechatUser(wxUserInfo)

      return token
    }
  }
}
