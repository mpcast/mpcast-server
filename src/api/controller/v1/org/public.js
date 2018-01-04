/* eslint-disable prefer-reflect,no-return-await,no-undef */
const BaseRest = require('./_rest')
const jwt = require('jsonwebtoken')

module.exports = class extends BaseRest {
  //
  // GET ACTIONS
  //
  async getAction () {
    const action = this.get('action')
    if (!think.isEmpty(action)) {
      switch (action) {
        case 'subdomain_validation': {
          const subdomain = this.get('subdomain')
          return await this.subdomainValidation(subdomain)
        }
        default: {
          return this.fail('非法请求！')
        }
      }
    }
    if (!think.isEmpty(this.get('orgId'))) {
      return await this.orgInfo()
    }
  }

  async orgInfo () {
    try {
      let data = await this.model('orgs').where({[this.modelInstance.pk]: this.orgId}).find();
      for (let meta of data.metas) {
        if (meta.meta_key === 'basic') {
          data.basic = JSON.parse(meta.meta_value)
          data = Object.assign(data, data.basic)
          Reflect.deleteProperty(data, 'basic')
        }
      }
      delete data.metas;
      for (let app of data.apps) {
        if (!Object.is(app.metas, undefined)) {
          _formatOneMeta(app)
          app = Object.assign(app, app.meta.info)
          Reflect.deleteProperty(app, 'meta')
        }
      }
      return this.success(data);
    } catch (e) {
      return this.fail()
    }
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

  //
  // POST ACTIONs
  //
  async _format_Meta (posts) {
    const _items = [];

    for (const post of posts) {
      post.meta = {};
      if (post.metas.length > 0) {
        for (const meta of post.metas) {
          // console.log(meta.meta_key + ":" + meta.meta_value);
          post.meta[meta.meta_key] = meta.meta_value;
        }
      }
      delete post.metas;
      _items.push(post);
    }
    return _items;
  }

  // async postAction () {
  //   const data = this.post()

  // 应用建设开通
  // const db = think.service('installApp', 'common', {appId: think.id.generate()})
  // await db.create()
  // }

  async postAction () {
    const action = this.get('action')
    switch (action) {
      case 'signin': {
        return await this.signin()
      }
      case 'signout': {
        return this.success('signin')
      }
      case 'signup': {
        return await this.signup()
      }
      default: {
        return this.fail('非法请求')
      }
    }
    // return this.success('org signing ...')
  }

  /**
   * 用户注册
   * @returns {Promise.<*>}
   */
  async signup () {
    const action = this.get('action')
    // 机构开通
    const data = this.post()
    const code = data.code
    const identity = data.identity
    // 验证短信码是否合法，成功后销毁
    const verify = await verifyMsgCode(identity, code, true)
    if (verify) {
      // 获取 orgId
      try {
        // 1 Create Org
        const orgId = await this.model('orgs').add({
          subdomain: data.subdomain,
          create_time: new Date().getTime(),
          update_time: new Date().getTime()
        })

        const orgs = await think.model('orgs').get()
        await think.cache('orgs', JSON.stringify(orgs))

        // 2 Create Org Table
        // const db = this.service('orginit', {orgId: orgId})
        // const error = await db.create()
        // if (think.isEmpty(error)) {
        // 3 Create Org Administrator
        const userModel = think.model('users')
        // 添加机构用户
        await userModel.addOrgUser({
          org_id: orgId,
          user_login: data.user_login,
          user_nicename: data.user_nicename ? data.user_nicename : data.user_login,
          user_pass: data.user_pass,
          user_email: data.user_email,
          user_phone: data.user_phone,
          role: 'Adminstrator'
        })
        // }

        // 4 Register Org Meta
        const metaModel = think.model('orgmeta')
        await metaModel.add({
          org_id: orgId,
          meta_key: 'basic',
          meta_value: JSON.stringify({
            name: data.org_name,
            plan: 'basic',
            logo_url: '',
            subdomain: data.subdomain,
            description: data.description
          })
        })

        // 5 Registration log
        const logModel = think.model('registration_log')
        await logModel.add({
          user_email: data.user_email,
          user_phone: data.user_phone,
          created: new Date().getTime(),
          org_id: orgId,
          ip: _ip2int(this.ip)
        })

        return this.success(data.subdomain)
      } catch (e) {
        think.logger.error(e)
        return this.fail(e)
      }
    }

    return this.fail('非法数据提交！')
  }

  /**
   * 登录
   * @returns {Promise.<*>}
   */
  async signin () {
    const orgId = this.get('orgId')
    if (think.isEmpty(orgId)) {
      return this.fail('机构信息错误')
    }
    const data = this.post()
    if (think.isEmpty(data.user_login)) {
      return this.fail('登录名不能为空');
    }
    const userLogin = data.user_login;

    const userModel = this.model('users');
    const userInfo = await userModel.where({user_login: userLogin}).find();
    // 验证用户是否存在
    if (think.isEmpty(userInfo)) {
      return this.fail(404, 'ACCOUNT_NOT_FOUND');
    }
    // 验证机构中是否存在此用户并处理用户角色权限
    _formatOneMeta(userInfo)
    if (!think.isEmpty(userInfo.meta.avatar)) {
      userInfo.avatar = await this.model('postmeta').getAttachment('file', userInfo.meta.avatar)
    }
    if (!Object.is(userInfo.meta[`org_${orgId}_capabilities`], undefined)) {
      userInfo.role = userInfo.meta[`org_${orgId}_capabilities`].role
    } else {
      return this.fail('ACCOUNT_FORBIDDEN');
    }
    // 帐号是否被禁用，且投稿者不允许登录
    if ((userInfo.user_status | 0) !== 1 || userInfo.deleted === 1) {
      return this.fail('ACCOUNT_FORBIDDEN');
    }

    // 校验密码
    const password = data.user_pass;
    if (!userModel.checkPassword(userInfo, password)) {
      return this.fail(400, 'ACCOUNT_PASSWORD_ERROR');
    }
    // return this.success(userInfo)
    // 获取签名盐
    const token = await jwt.sign({userInfo}, 'S1BNbRp2b', {expiresIn: '3d'})
    // user: userInfo.user_login,
    // let validity_days = 7;
    // let expires = validity_days * 1000 * 60 * 60 * 24;
    // const user = jwt.verify();
    // const user = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJpZCI6MTUsInVzZXJfbG9naW4iOiJhZG1pbiIsInVzZXJfcGFzcyI6IiQyYSQwOCRybDFpb29TMHN3YW1uck1jL0dtU3VlTTh0MWRXdzB1bjdMaHhCdzkxRnRsNUNldG9iZVAzYSIsInVzZXJfbmljZW5hbWUiOiLnrqHnkIblkZgiLCJ1c2VyX2VtYWlsIjoiYmFpc2hlbmdAb3V0bG9vay5jb20iLCJ1c2VyX3VybCI6bnVsbCwidXNlcl9yZWdpc3RlcmVkIjoxNTAzODEwMzIwOTk2LCJ1c2VyX2FjdGl2YXRpb25fa2V5IjpudWxsLCJ1c2VyX3N0YXR1cyI6MSwiZGlzcGxheV9uYW1lIjpudWxsLCJzcGFtIjowLCJkZWxldGVkIjowLCJ1c2VyX3Bob25lIjpudWxsLCJtZXRhIjp7InBpY2tlcl8xX2NhcGFiaWxpdGllcyI6eyJyb2xlIjoiZWRpdG9yIn0sIm9yZ18xX2NhcGFiaWxpdGllcyI6eyJyb2xlIjoiYWRtaW4ifSwicGlja2VyXzFfd3hhcHAiOiIxIiwiYXZhdGFyIjoiMjMifSwiYXZhdGFyIjoiaHR0cDovL2RhdGEucGlja2VyLmNjL3VwbG9hZF82OGMwYjM5MjcxNzViNjIyN2EyMmQ2NjIxYjY2YjBjOS5qcGciLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNTA3ODgzMjM1LCJleHAiOjE1MDgxNDI0MzV9.CfdEENtA_NW6vLmZdNnpaUZf3eHJMC7hKiHTfxLv1Xc', 'S1BNbRp2b');
    // return this.success(user)
    return this.success({user: userInfo.user_login, token: {value: token, expires: 3}});
    // }
  }

}
