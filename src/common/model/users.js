/* eslint-disable prefer-promise-reject-errors,no-console,prefer-promise-reject-errors,prefer-promise-reject-errors,no-warning-comments */
const Base = require('./base');
const {PasswordHash} = require('phpass');
let fields = [
  'id',
  'user_login as login',
  // 'user_pass as pass',
  'user_nicename as nicename',
  'user_email as email',
  // 'user_url as url',
  'user_status as status'
]
module.exports = class extends Base {

  get relation () {
    return {
      metas: {
        type: think.Model.HAS_MANY,
        model: 'usermeta',
        // rModel: 'usermeta',
        fKey: 'user_id'
      }
    };
  }

  /**
   * get password
   * @param  {String} username []
   * @param  {String} salt     []
   * @return {String}          []
   */
  getEncryptPassword (password) {
    const passwordHash = new PasswordHash();
    const hash = passwordHash.hashPassword(password);
    return hash;
  }

  /**
   * check password
   * @param  {[type]} userInfo [description]
   * @param  {[type]} password [description]
   * @return {[type]}          [description]
   */
  checkPassword (userInfo, password) {
    const passwordHash = new PasswordHash();
    return passwordHash.checkPassword(password, userInfo.user_pass);
  }

  // checkUserRole(userInfo) {
  //
  // }
  generateKey (userId, appKey, appSecret, status) {
    const data = {appKey, appSecret};
    if (status) {
      data.status = status;
    }
    this.where({id: userId}).update(data);
  }

  /**
   * 查询微信注册来的用户
   * @param openId
   * @returns {Promise.<*>}
   */
  async getByWxApp (openId) {
    let user = await this.where({user_login: openId}).find()
    return user
  }

  /**
   * 根据 id 查找用户
   * @param user_id
   * @returns {Promise.<void>}
   */
  async getById(user_id) {
    const user = await this.field(fields).where({
      id: user_id
    }).find()
    const meta = await this.model('usermeta').where({user_id: user_id}).select()
    user.metas = meta
    return user
  }
/*
{ openId: 'oQgDx0IVqAg0b3GibFYBdtg3BKMA',
  nickName: '请好好说话🌱',
  gender: 1,
  language: 'en',
  city: 'Chaoyang',
  province: 'Beijing',
  country: 'China',
  avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep0GdQEHK3tYdvq3DTMVhsdiaviaLg6b7CdDBLOYSWDGYOEtS7FFmvhd6CGCuQVfe4Rb0uQUlaq7XoA/0',
  watermark: { timestamp: 1508809460, appid: 'wxca1f2b8b273d909e' },
  appId: 'S11SeYT2W' }
*/
async updateWechatUser (data) {
    // const createTime = new Date().getTime();
    try {
      // 用户信息
      await this.thenUpdate({user_nicename: data.nickName}, {user_login: data.openId})
      // Meta 数据
      const usermeta = this.model('usermeta')
      await usermeta.thenUpdate({
        user_id: `${data.userId}`,
        meta_key: `picker_${data.appId}_wechat`,
        meta_value: JSON.stringify(data)
      }, {
        user_id: `${data.userId}`,
        meta_key: `picker_${data.appId}_wechat`
      })
    } catch(e) {
      console.log(e)
      throw e
    }
  }
  /**
   * 添加从微信过来的用户
   *
   * @param data
   * @returns {Promise.<*>}
   */
  async saveWechatUser (data) {
    const createTime = new Date().getTime();
    const res = await this.where({
      user_login: data.openId
    }).thenAdd({
      user_login: data.openId,
      // user_nicename: data.nickName,
      user_registered: createTime,
      user_status: 1
    });
    // Add user meta info
    if (!think.isEmpty(res)) {
      if (res.type === 'add') {
        // const role = think.isEmpty(data.role) ? 'subscriber' : data.role
        const usermeta = this.model('usermeta')
        await usermeta.add({
          user_id: res.id,
          meta_key: data.appId ? `picker_${data.appId}_capabilities` : '_capabilities',
          meta_value: JSON.stringify({'role': 'subscriber', 'type': 'wechat'})
        }, {appId: data.appId})

        await usermeta.add({
          user_id: res.id,
          // 用于标识用户类型
          meta_key: `picker_${data.appId}_wechat`,
          meta_value: JSON.stringify(data)
        })
      }
      // TODO: basi 2017.10.19 这里会有更新操作，如果同一用户授权我们服务的其它应用，就要更新关联的应用
    }
    return res
  }

  async save (data) {
    if (think.isEmpty(data.id)) {
      // Add
      const createTime = new Date().getTime();
      const encryptPassword = this.getEncryptPassword(data.user_pass);
      const res = await this.where({
        user_login: data.user_login,
        // user_phone: data.user_phone,
        user_email: data.user_email,
        _logic: 'OR'
      }).thenAdd({
        user_login: data.user_login,
        user_email: data.user_email,
        user_phone: data.user_phone,
        user_nicename: data.user_nicename,
        user_pass: encryptPassword,
        user_registered: createTime,
        user_status: 1
      });
      if (!think.isEmpty(res)) {
        if (res.type === 'add') {
          const role = think.isEmpty(data.role) ? 'subscriber' : data.role
          const usermeta = this.model('usermeta')
          await usermeta.add({
            user_id: res.id,
            meta_key: data.appId ? `picker_${data.appId}_capabilities` : '_capabilities',
            meta_value: JSON.stringify({'role': role, 'type': 'team'})
          }, {appId: data.appId})
          // 后续这里的用户简介可以处理与 resume 模型关联
          if (!think.isEmpty(data.summary)) {
            await usermeta.save(res.id, {
              'resume': JSON.stringify({"summary": data.summary})
            })
          }
          if (!think.isEmpty(data.avatar)) {
            await usermeta.save(res.id, {
              'avatar': data.avatar
            })
          }
        }
      }
    } else {
      // Update
      const info = await this.where({id: data.id}).find();
      if (think.isEmpty(info)) {
        return Promise.reject(new Error('UESR_NOT_EXIST'));
      }
      let password = data.user_pass;
      if (password) {
        password = this.getEncryptPassword(password);
      }
      let updateData = {};
      // ['display_name', 'type', 'status'].forEach(item => {
      //   if (data[item]) {
      //     updateData[item] = data[item];
      //   }
      // });
      updateData = data
      if (password) {
        updateData.user_pass = password;
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      if (think.isEmpty(updateData)) {
        return Promise.reject('DATA_EMPTY');
      }
      if (!info.email && data.email) {
        const count = await this.where({email: data.email}).count('email');
        if (!count) {
          updateData.email = data.email;
        }
      }
      updateData.last_login_time = new Date().getTime();

      // updateData.last_login_ip = ip;
      const res = await this.where({id: data.id}).update(updateData);
      if (!think.isEmpty(res)) {
        const role = think.isEmpty(data.role) ? 'subscriber' : data.role
        const usermeta = this.model('usermeta')
        await usermeta.add({
          user_id: res.id,
          meta_key: data.appId ? `picker_${data.appId}_capabilities` : '_capabilities',
          meta_value: JSON.stringify({'role': role, 'type': 'team'})
        }, {appId: data.appId})
        // 后续这里的用户简介可以处理与 resume 模型关联
        if (!think.isEmpty(data.summary)) {
          await usermeta.save(res.id, {
            'resume': JSON.stringify({"summary": data.summary})
          })
        }
        if (!think.isEmpty(data.avatar)) {
          await usermeta.save(res.id, {
            'avatar': data.avatar
          })
        }
      }
    }
  }

  /**
   * 添加用户
   * @param {[type]} data [description]
   * @param {[type]} ip   [description]
   */
  async addUser (data) {
    const createTime = new Date().getTime();
    const encryptPassword = this.getEncryptPassword(data.user_pass);
    const res = await this.where({
      user_login: data.user_login,
      // user_phone: data.user_phone,
      user_email: data.user_email,
      _logic: 'OR'
    }).thenAdd({
      user_login: data.user_login,
      user_email: data.user_email,
      user_phone: data.user_phone,
      user_nicename: data.user_nicename,
      user_pass: encryptPassword,
      user_registered: createTime,
      user_status: 1
    });
    // Add user meta info
    if (!think.isEmpty(res)) {
      if (res.type === 'add') {
        const role = think.isEmpty(data.role) ? 'subscriber' : data.role
        const usermeta = this.model('usermeta')
        await usermeta.add({
          user_id: res.id,
          meta_key: data.appid ? `picker_${data.appid}_capabilities` : '_capabilities',
          meta_value: JSON.stringify({'role': role, 'type': 'team'})
        }, {appId: this.appId})
        // 后续这里的用户简介可以处理与 resume 模型关联
        if (!think.isEmpty(data.summary)) {
          await usermeta.save(res.id, {
            'resume': JSON.stringify({"summary": data.summary})
          })
        }
        if (!think.isEmpty(data.avatar)) {
          await usermeta.save(res.id, {
            'avatar': data.avatar
          })
        }
      }
    }
    return res
  }

  async addOrgUser (data) {
    const createTime = new Date().getTime();
    const encryptPassword = this.getEncryptPassword(data.user_pass);
    const res = await this.where({
      user_login: data.user_login,
      // user_phone: data.user_phone,
      user_email: data.user_email,
      _logic: 'OR'
    }).thenAdd({
      user_login: data.user_login,
      user_email: data.user_email,
      user_phone: data.user_phone,
      user_nicename: data.user_nicename,
      user_pass: encryptPassword,
      user_registered: createTime,
      user_status: 1
    });
    // Add user meta info
    if (!think.isEmpty(res)) {
      if (res.type === 'add') {
        const role = think.isEmpty(data.role) ? 'subscriber' : data.role
        const usermeta = this.model('usermeta')
        await usermeta.add({
          user_id: res.id,
          meta_key: `org_${data.org_id}_capabilities`,
          meta_value: JSON.stringify({'role': role, 'type': 'org'})
        }, {appId: this.appId})
        // 后续这里的用户简介可以处理与 resume 模型关联
        if (!think.isEmpty(data.summary)) {
          await usermeta.save(res.id, {
            'resume': JSON.stringify({"summary": data.summary})
          })
        }
        if (!think.isEmpty(data.avatar)) {
          await usermeta.save(res.id, {
            'avatar': data.avatar
          })
        }
      }
    }
    return res
  }

  /**
   * 保存用户信息
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  async saveUser (data, ip) {
    const info = await this.where({id: data.id}).find();
    if (think.isEmpty(info)) {
      return Promise.reject(new Error('UESR_NOT_EXIST'));
    }
    let password = data.password;
    if (password) {
      password = this.getEncryptPassword(password);
    }
    const updateData = {};
    ['display_name', 'type', 'status'].forEach(item => {
      if (data[item]) {
        updateData[item] = data[item];
      }
    });
    if (password) {
      updateData.password = password;
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    if (think.isEmpty(updateData)) {
      return Promise.reject('DATA_EMPTY');
    }
    if (!info.email && data.email) {
      const count = await this.where({email: data.email}).count('email');
      if (!count) {
        updateData.email = data.email;
      }
    }
    updateData.last_login_time = think.datetime();
    updateData.last_login_ip = ip;
    return this.where({id: data.id}).update(updateData);
  }

  /**
   * 根据用户ID获取用户显示名字
   * @param  integer $uid 用户ID
   * @return string       用户昵称
   */

  async displayName (uid) {
    uid = uid || 0;
// eslint-disable-next-line no-warning-comments
    // TODO 缓存处理后续
    let name = '';
    const info = await this.field('display_name').find(uid);
    name = info.display_name;
    return name;
  }

  // async getUserMeta(key)
  async getLikedPost (appid, post_id) {
    const userMeta = this.model('usermeta')
    const data = await userMeta.where(`meta_value ->'$.post_id' = '${post_id}' and meta_key = 'picker_${appid}_liked_posts'`).select()
  }
  async likedPost (appid, post_id) {
    const userMeta = this.model('usermeta')
    const data = await userMeta.where(`meta_value ->'$.post_id' = '${post_id}' and meta_key = 'picker_${appid}_liked_posts'`).select()
  }
  /**
   * 添加新喜欢的人员
   * @param user_id
   * @param post_id
   * @returns {Promise.<void>}
   */
  async newLike (user_id, app_id, post_id) {
    const userMeta = this.model('usermeta')

    const result = await userMeta.where({
      user_id: user_id,
      meta_key: `picker_${app_id}_liked_posts`
    }).find()

    let likeCount = 0
    if (!think.isEmpty(result)) {
      if (!think.isEmpty(result.meta_value)) {
        likeCount = JSON.parse(result.meta_value).length
        const iLike = await think._.find(JSON.parse(result.meta_value), ['post_id', post_id])
        if (!iLike) {
          await userMeta.where({
            user_id: user_id,
            meta_key: `picker_${app_id}_liked_posts`
          }).update({
            'user_id': user_id,
            'meta_key': `picker_${app_id}_liked_posts`,
            'meta_value': ['exp', `JSON_ARRAY_APPEND(meta_value, '$', JSON_OBJECT('post_id', '${post_id}','date', '${new Date().getTime()}'))`]
          })
          likeCount++
        }
      }
    } else {
      // 添加
      const res = await userMeta.add({
        user_id: user_id,
        meta_key: `picker_${app_id}_liked_posts`,
        meta_value: ['exp', `JSON_ARRAY(JSON_OBJECT('post_id', '${post_id}', 'date', '${new Date().getTime()}'))`]
      })
      if (res > 0) {
        likeCount++
      }
    }
  }

  /**
   * UnLike post
   * @param user_id
   * @param post_id
   * @returns {Promise<number>}
   */
  async unLike (user_id, app_id, post_id) {
    console.log(user_id + ':' + app_id + ':' + post_id)
    // const res = await this.where(`user_id = '${user_id}' AND meta_key = 'picker_${app_id}_liked_posts' AND JSON_SEARCH(meta_value, 'one', ${post_id}) IS NOT NULL`).update({
    //     'meta_value': ['exp', `JSON_REMOVE(meta_value, SUBSTRING_INDEX(REPLACE(JSON_SEARCH(meta_value, 'one', '${post_id}', NULL, '$**.post_id'), '"', ''), '.', 1))`]
    //   }
    // )
    // return res
  }
}
