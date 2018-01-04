/* eslint-disable default-case,no-undef,no-warning-comments */
const Base = require('../Base')
const jwt = require('jsonwebtoken')

module.exports = class extends Base {
  constructor (ctx) {
    super(ctx);
    this.DAO = this.model('users')
    this.metaDAO = this.model('usermeta')
  }

  async indexAction () {
    // 获取用户信息
    if (this.isGet) {
      const userId = this.get('id')
      const appid = this.get('appId')
      const userMeta = this.model('usermeta')
      let type = this.get('type')

      // 根据 id 获取单用户
      if (!think.isEmpty(userId)) {
        const user = await this.model('users').where({id: userId}).find()
        _formatOneMeta(user)
        if (!think.isEmpty(user.meta[`picker_${appid}_wechat`])) {
          user.avatar = user.meta[`picker_${appid}_wechat`].avatarUrl
          // user.type = 'wechat'
        } else {
          user.avatar = await this.model('postmeta').getAttachment('file', user.meta.avatar)
        }
        return this.success(user)
      } else {
        if (think.isEmpty(type)) {
          type = 'team'
        }
        // 获取用户默认获取团队成员
        // const userIds = await userMeta.where(query).select()
        const userIds = await userMeta.where(`meta_value ->'$.type' = '${type}' and meta_key = 'picker_${appid}_capabilities'`).select()
        if (think.isEmpty(userIds)) {
          return this.success([])
        }

        const ids = []
        userIds.forEach((item) => {
          ids.push(item.user_id)
        })
        const users = await this.model('users').where({id: ['IN', ids]}).page(this.get('page'), 50).countSelect()
        _formatMeta(users.data)
        for (const user of users.data) {
          if (!think.isEmpty(user.meta.avatar)) {
            user.avatar = await this.model('postmeta').getAttachment('file', user.meta.avatar)
          } else if (!think.isEmpty(user.meta[`picker_${appid}_wechat`])) {
            user.avatar = user.meta[`picker_${appid}_wechat`].avatarUrl
            // user.type = 'wechat'
          }
        }
        return this.success(users)
      }
    }

    // 更新用户信息
    if (this.isPost) {
      const data = this.post()
      if (think.isEmpty(data)) {
        return this.fail('Data is empty');
      }
      if (data.id !== this.get('id')) {
        return this.fail('Data is fail.')
      }
      data.appId = this.appId
      await this.DAO.save(data)
      const newUser = await this.DAO.where({
        id: data.id
      }).find()
      return this.success(newUser)
    }
  }


  async put () {
    const data = this.post()
    const approach = this.post('approach')
    // 注册用户来源
    switch (approach) {
      // 微信小程序
      case 'wxapp': {
        // 判断用户是否已注册
        const wxUser = await this.DAO.getByWxApp(data.openId)
        if (!think.isEmpty(wxUser)) {
          // 获取 token
          const token = await this.createToken(approach, data)
          return this.success({userId: wxUser.id, token: token, token_type: 'Bearer'})
        } else {
          const userInfo = {
            appid: this.appId,
            user_login: data.openId,
            user_nicename: data.nickName,
            wxapp: data
          }
          const userId = await this.DAO.addWxAppUser(userInfo)
          const token = await this.createToken(approach, data)
          return this.success({userId: userId, token: token, token_type: 'Bearer'})
        }
      }
      default: {
        if (think.isEmpty(data)) {
          return this.fail('data is empty');
        }
        data.appId = this.appId
        await this.DAO.save(data)
        return this.success()
      }
    }
  }

  /**
   * 根据用户来源创建 token
   * @param approach
   * @param data
   * @returns {Promise.<*>}
   */
  async createToken (approach, data) {
    switch (approach) {
      case 'password': {
        break
      }
      case 'wxapp': {
        const token = jwt.sign(data, 'shared-secret', {expiresIn: '3d'})
        return token
      }
    }
    // const token = jwt.sign(userInfo, 'shared-secret', {expiresIn: '3d'})
    // user: userInfo.user_login,
    // return this.success({user: userInfo.user_login, token: token});
  }

  /**
   * 删除用户与用户所有的数据
   *
   * @returns {Promise.<*>}
   */
  async deleteAction () {
    // TODO: 先要处理用户权限 问题
    // console.log(this.ctx.state.user)
    const user_id = this.get('id')
    const data = this.post()
    // let reassign = this.options.default.reassign
    let reassign = 0
    let rows = 0
    if (!think.isEmpty(data) && data.reassign) {
      reassign = data.reassign
      // 验证 reassign 用户是否存在
      const check = await this.model('users', {appid: this.appId}).where({
        id: reassign
      }).find()

      if (think.isEmpty(check)) {
        return this.fail('数据迁移用户不存在!')
      }
    }
    // 更新数据归属至 reassign
    // 将内容分配给指定的用户
    if (reassign > 0) {
      await this.model('posts', {appId: this.appId}).where({author: user_id}).update({
        author: reassign
      })
    } else {
      await this.model('posts', {appId: this.appId}).where({author: user_id}).delete()
    }
    // 删除用户
    await this.DAO.where({
      id: user_id
    }).delete()

    return this.success()
  }
}
