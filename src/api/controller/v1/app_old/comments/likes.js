/* eslint-disable no-undef */
const BaseRest = require('../_rest.js');
module.exports = class extends BaseRest {

  /**
   * 查询全部 liked 用户
   * @returns {Promise.<void>}
   */
  async indexAction () {
    const id = this.get('id')
    const userId = this.ctx.state.user.userInfo.id
    const postMeta = this.model('postmeta', {appId: this.appId})

    const result = await postMeta.where({
      post_id: id,
      meta_key: '_liked'
    }).find()
    // 当前登录用户是否喜欢
    let iLike = false
    const likes = []
    const userModel = this.model('users')
    let totalCount = 0

    if (!think.isEmpty(result)) {
      if (!think.isEmpty(result.meta_value)) {
        const exists = await think._.find(JSON.parse(result.meta_value), ['id', userId])
        if (exists) {
          iLike = true
        }
        const list = JSON.parse(result.meta_value)
        totalCount = list.length
        for (const u of list) {
          const user = await userModel.where({id: u.id}).find()
          likes.push(user)
        }
      }
    }
    return this.success({
      found: totalCount,
      i_like: iLike,
      post_id: id,
      likes: likes
    })
  }
  /**
   * New like
   * @returns {Promise.<*>}
   */
  async newAction () {
    const userId = this.ctx.state.user.userInfo.id
    const id = this.get('id')
    const postMeta = this.model('postmeta', {appId: this.appId})
    const result = await postMeta.where({
      post_id: id,
      meta_key: '_liked'
    }).find()
    let likeCount = 0
    if (!think.isEmpty(result)) {
      if (!think.isEmpty(result.meta_value)) {
        likeCount = JSON.parse(result.meta_value).length
        const iLike = await think._.find(JSON.parse(result.meta_value), ['id', userId.toString()])
        if (!iLike) {
          await postMeta.newLike(userId, id, this.ip)
          likeCount++
        }
      }
    } else {
      // 添加
      const res = await postMeta.add({
        post_id: id,
        meta_key: '_liked',
        meta_value: ['exp', `JSON_ARRAY(JSON_OBJECT('id', '${userId}', 'ip', '${_ip2int(this.ip)}'))`]
      })
      if (res > 0) {
        likeCount++
      }
    }

    return this.success({
      i_like: true,
      like_count: likeCount,
      post_id: id
    })
    // .exp
    //   "success": true,
    //     "i_like": true,
    //     "like_count": 31,
    //     "site_ID": 2916284,
    //     "post_ID": 1,
    //     "meta": {
    //     "links": {
    //       "help": "https:\/\/public-api.wordpress.com\/rest\/v1\/sites\/2916284\/posts\/1\/likes\/new\/help",
    //         "post": "https:\/\/public-api.wordpress.com\/rest\/v1\/sites\/2916284\/posts\/1",
    //         "site": "https:\/\/public-api.wordpress.com\/rest\/v1\/sites\/2916284"
    //     }
    //   }
  }

  /**
   * Default get
   * Get the current user's like status for a post
   *
   * Post action delete
   * Unlike apost
   * @returns {Promise.<void>}
   */
  async mineAction () {
    const postMeta = this.model('postmeta', {appId: this.appId})
    const userId = this.ctx.state.user.userInfo.id

    // 返回用户是否 like 此 post
    if (this.isGet) {
      // Current User
      const data = await postMeta.getLikeStatus(userId, this.id)
      // if (!think.isEmpty(data.value_index))
      console.log(JSON.stringify(data))
      const res = {
        'i_like': data.contain === 1,
        'like_count': data.like_count,
        'post_id': this.id
      }
      return this.success(res)
    }

    if (this.isPost) {
      const action = this.get('action')
      if (action === 'delete') {

        await postMeta.unLike(userId, this.id)
        const likeCount = await postMeta.getLikedCount(this.id)
        const res = {
          'i_like': false,
          'like_count': likeCount,
          'post_id': this.id
        }
        return this.success(res)
      }
    }
  }
};
