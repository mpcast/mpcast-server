/* eslint-disable no-undef,radix */
const BaseRest = require('../Base');
module.exports = class extends BaseRest {

  /**
   * 查询全部 liked 用户
   * @returns {Promise.<void>}
   */
  async indexAction () {
    const id = this.get('id')
    const userId = this.ctx.state.user.id
    const postMeta = this.model('postmeta', {appId: this.appId})

    return this.dealThumbs(id)
  }
  /**
   * 处理内容喜欢的信息
   * @param post
   * @returns {Promise.<void>}
   */
  async dealThumbs (post_id) {
    const userId = this.ctx.state.user.id
    const postMeta = this.model('postmeta', {appId: this.appId})

    const result = await postMeta.where({
      post_id: post_id,
      meta_key: '_thumbs'
    }).find()
    // 当前登录用户是否喜欢
    let iThumb = false
    const thumbs = []
    const userModel = this.model('users')
    let totalCount = 0
    if (!think.isEmpty(result)) {
      if (!think.isEmpty(result.meta_value)) {
        const exists = await think._.find(JSON.parse(result.meta_value), ['id', userId.toString()])
        if (exists) {
          iThumb = true
          // post.like_date = exists.date
        }
        const list = JSON.parse(result.meta_value)
        totalCount = list.length
        for (const u of list) {
          let user = await userModel.where({id: u.id}).find()
          thumbs.push(user)
        }
      }
    }

    _formatMeta(thumbs)

    for (let user of thumbs) {
      Reflect.deleteProperty(user, 'meta')
    }

    return this.success({
      found: totalCount,
      i_like: iThumb,
      post_id: post_id,
      likes: thumbs
    })
  }

  /**
   * New thumb
   * @returns {Promise.<*>}
   */
  async newAction () {
    const userId = this.ctx.state.user.id
    const id = this.get('id')
    const postMeta = this.model('postmeta', {appId: this.appId})
    // const userMeta = this.model('usermeta')

    const result = await postMeta.where({
      post_id: id,
      meta_key: '_thumbs'
    }).find()
    let thumbsCount = 0
    if (!think.isEmpty(result)) {
      if (!think.isEmpty(result.meta_value)) {
        thumbsCount = JSON.parse(result.meta_value).length
        const iThumb = await think._.find(JSON.parse(result.meta_value), ['id', userId.toString()])
        if (!iThumb) {
          await postMeta.newThumb(userId, id, this.ip, date)
          thumbsCount++
        }
      }
    } else {
      // 添加
      const res = await postMeta.add({
        post_id: id,
        meta_key: '_thumbs',
        meta_value: ['exp', `JSON_ARRAY(JSON_OBJECT('id', '${userId}', 'ip'))`]
      })
      if (res > 0) {
        thumbsCount++
      }
    }
    // 这里不向用户的meta 信息中添加，赞的信息了, 数据非关键数据
    // await this.model('users').newLike(userId, this.appId, id, date)

    return this.success({
      i_thumb: true,
      thumbs_count: thumbsCount,
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
    const userId = this.ctx.state.user.id

    // 返回用户是否 like 此 post
    if (this.isGet) {
      // Current User
      const data = await postMeta.getThumbStatus(userId, this.id)
      // if (!think.isEmpty(data.value_index))
      const res = {
        'i_thumb': data.contain === 1,
        'thumb_count': data.like_count,
        'post_id': this.id
      }
      return this.success(res)
    }

    if (this.isPost) {
      const action = this.get('action')
      if (action === 'delete') {
        await postMeta.unThumb(userId, this.id)
        const likeCount = await postMeta.getThumbsCount(this.id)
        const res = {
          'i_thumb': false,
          'thumb_count': likeCount,
          'post_id': this.id
        }
        return this.success(res)
      }
    }
  }
};
