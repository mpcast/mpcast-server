/* eslint-disable no-undef,no-return-await */
const BaseRest = require('./Base')
// import speakeasy from 'speakeasy';
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

module.exports = class extends BaseRest {

  /**
   * 生成用户登录 Token
   * @returns {Promise<*|boolean>}
   */
  async tokenAction () {
    console.log('my token ....')
    if (this.isGet) {
      const code = this.get('code')
      console.log('test .....')
      if (!think.isEmpty(code)) {
        try {
          const {user, token} = await this.wxLogin(code)
          // 返回 token 信息
          return this.success({user: user, token: token})
        } catch (e) {
          return this.fail(e)
        }
      } else {
        return this.fail(400, '未能验证 code')
      }
    }

    return this.fail(400, '不支持 POST 请求')
  }

  /**
   * 验证用户 Token
   * @returns {Promise<void>}
   */
  async verifyAction () {
    if (this.isPost) {
      const data = this.post()
      jwt.verify(data.token, 'S1BNbRp2b', (err, decoded) => {
        if (err) {
          return this.fail({"errno": 1000, data: err})
          /*
            err = {
              name: 'TokenExpiredError',
              message: 'jwt expired',
              expiredAt: 1408621000
            }
          */
        }
        return this.success({verify: 'success'})
      })
    }
  }

  /**
   * 解码用户信息
   * @returns {Promise.<*>}
   */
  async decodeAction () {
    return await this.decodeUserInfo()
  }

  async decodeUserInfo () {
    const data = this.post()
    // 微信用户的 name === openId, 用前缀加以区分数据在 redis 中
    const redisUserKey = `${this.wechatService.keyPrefix}${this.ctx.state.user.user_login}`
    const user_id = this.ctx.state.user.id
    let wxUserInfo = await this.wechatService.getUserInfo(data.encryptedData, data.iv, redisUserKey)

    // 更新用户信息
    const userModel = this.model('users')
    wxUserInfo = think.extend({}, wxUserInfo, {appId: this.appId}, {userId: user_id})
    await userModel.setRelation(false).updateWechatUser(wxUserInfo)

    return this.success(wxUserInfo)
  }

  /**
   * 检查数据完整性
   * @returns {Promise.<*>}
   */
  async checkAction () {
    console.log('che action .....')
    if (this.isPost) {
      const data = this.post()
      // '{"nickName":"请好好说话🌱","gender":1,"language":"en","city":"Chaoyang","province":"Beijing","cy":"China","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep0GdQEHK3tYdvq3DTMVhsdiaviaLg6b7CdDBLOYSWDGYOEtS7FFmvhd6CGCuQVfe4Rb0uQUlaq7XoA/0"}',
      //   signature: 'e9dfe22dfb4fbbad0ec359cb498915b84860295d' }
      const signature1 = data.signature
      const rawData = data.rawData
      console.log(data)
      try {
        console.log(this.ctx.state.user)
        const redisUserKey = `${this.wechatService.keyPrefix}${this.ctx.state.user.user_login}`
        const wxUser = await this.wechatService.getSessionKey(redisUserKey)
        const sha1 = crypto.createHash('sha1')
        sha1.update(rawData.toString() + wxUser.session_key)
        const signature2 = sha1.digest('hex')
        if (signature1 === signature2) {
          return this.success()
        } else {
          throw new Error('Signature not eq')
        }
      } catch (e) {
        console.error(e)
        throw new Error('Signature Error')
      }
    }
  }

  /**
   * 微信用户登录
   * @param code
   * @returns {Promise.<*>}
   */
  async wxLogin (code) {
    try {
      const data = await this.wechatService.getKey(code)
      const openId = data.data.openid
      // 验证用户或保存为新用户
      const userModel = this.model('users')
      const res = await userModel.saveWechatUser({openId: openId, appId: this.appId})
      if (res) {
        const user = think.extend({}, res, {user_login: openId})
        return {user: user, token: jwt.sign(user, 'S1BNbRp2b', {expiresIn: '3d'})}
      }
    } catch (e) {
      console.error(e)
      throw e
    }
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
  }

}
