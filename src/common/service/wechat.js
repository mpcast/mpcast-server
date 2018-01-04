const httpx = require('httpx')
const querystring = require('querystring')
const WXBizDataCrypt = require('./lib/WXBizDataCrypt')

/**
 * 验证 session key
 */
class AccessSessionKey {
  constructor (data) {
    this.data = data
  }

  /**
   * 检查 AccessSesiionKey 是否有效，检查规则为当前时间和过期时间进行对比
   * @returns {boolean}
   */
  isValid () {
    return !!this.data.session_key && Date.now < this.data.create_at + this.data.expires_in * 1000
  }
}
module.exports = class extends think.Service {
  constructor (appid, appsecret, getSessionKey, saveSessionKey) {
    super()

    this.appid = appid
    this.appsecret = appsecret
    // session key 的获取和存储
    this.store = {}
    this.getSessionKey = getSessionKey || async function (openid) {
      return this.store[openid]
    }
    if (!saveSessionKey && process.env.NODE_ENV === 'production') {
      console.warn('Please dont save session key into memory under production')
    }
    this.saveSessionKey = saveSessionKey || async function (openid, session_key) {
      console.log(openid + '----' + session_key)
      this.store[openid] = session_key
    }
    this.defaults = {}
  }

  /**
   * 用于设置urllib的默认options
   *
   * Examples:
   * ```
   * oauth.setOpts({timeout: 15000});
   * ```
   * @param {Object} opts 默认选项
   */
  setOpts (opts) {
    this.defaults = opts;
  }

  /*!
   * urllib的封装
   *
   * @param {String} url 路径
   * @param {Object} opts urllib选项
   */
  async request (url, opts = {}) {
    const options = Object.assign({}, this.defaults);
    for (const key in opts) {
      if (key !== 'headers') {
        options[key] = opts[key];
      } else {
        if (opts.headers) {
          options.headers = options.headers || {};
          Object.assign(options.headers, opts.headers)
        }
      }
    }

    let data;
    try {
      const response = await httpx.request(url, options)
      const text = await httpx.read(response, 'utf8')
      data = JSON.parse(text);
    } catch (err) {
      err.name = 'WeChatAPI' + err.name;
      throw err;
    }

    if (data.errcode) {
      const err = new Error(data.errmsg);
      err.name = 'WeChatAPIError';
      err.code = data.errcode;
      throw err;
    }

    return data;
  }

  /*!
 * 处理 sessionKey，更新过期时间
 */
  async processSessionKey (data) {
    data.create_at = Date.now();
    // 存储token
    await this.saveSessionKey(data.openid, data);
    return new AccessSessionKey(data);
  }

  /**
   * 根据授权获取到的code，换取 session_key 和 openid
   * 获取openid之后，可以调用`wechat.API`来获取更多信息
   * Examples:
   * ```
   * await api.getSessionKey(code);
   * ```
   * Exception:
   *
   * - `err`, 获取 session key 出现异常时的异常对象
   *
   * 返回值:
   * ```
   * {
   *  data: {
   *    "session_key:": "SESSION_KEY",
   *    "expires_in": 7200,
   *    "openid": "OPENID"
   *  }
   * }
   * ```
   * @param {String} code 授权获取到的code
   */
  async getKey (code) {
    const info = {
      appid: this.appid,
      secret: this.appsecret,
      js_code: code,
      grant_type: 'authorization_code'
    };
    const url = `https://api.weixin.qq.com/sns/jscode2session?${querystring.stringify(info)}`
    try {
      const data = await this.request(url, {
        headers: {
          accept: 'application/json'
        }
      })
      return this.processSessionKey(data);
    }catch (err) {
      throw err
    }
    // if (!data) {
    //   let error = new Error('SessionKey Error')
    //   error.name = 'SessionKeyError'
    //   throw error
    // }
  }

  async getUserInfo (encrypted_data, iv, openid) {
    // if (typeof options !== 'object') {
    //   options = {
    //     openid: options
    //   }
    // }
    const data = await this.getSessionKey(openid)
    if (!data) {
      let error = new Error('No SessionKey for ' + openid + ', please authorize first.')
      error.name = 'NoSessionKeyError'
      throw error
    }
    // const session_info = await this.getKey(code)
    const crypt = new WXBizDataCrypt(this.appid, data.session_key)
    const info = crypt.decryptData(encrypted_data, iv)
    return info
  }

  async verifyWxApp(encrypted_data, iv, code) {
    const userInfo = await this.getUserInfo(encrypted_data, iv, code)
    // if (Object.is(userInfo.openid, undefined)) {
    //
    // }
  }

  async createToken(request) {
    // let approach =
  }
}
