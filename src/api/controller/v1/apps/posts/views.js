/* eslint-disable no-undef,radix */
const BaseRest = require('../Base');
module.exports = class extends BaseRest {

  /**
   * 查询全部 liked 用户
   * @returns {Promise.<void>}
   */
  async indexAction () {
    const id = this.get('id')
    // const userId = this.ctx.state.user.id
    // const postMeta = this.model('postmeta', {appId: this.appId})

    return this.dealViews(id)
  }
  /**
   * 处理内容喜欢的信息
   * @param post
   * @returns {Promise.<void>}
   */
  async dealViews (post_id) {
    const userId = this.ctx.state.user.id
    const postMeta = this.model('postmeta', {appId: this.appId})

    const result = await postMeta.where({
      post_id: post_id,
      meta_key: '_post_views'
    }).find()
    // 当前登录用户是否喜欢
    let iView = false
    const views = []
    const userModel = this.model('users')
    let totalCount = 0
    if (!think.isEmpty(result)) {
      if (!think.isEmpty(result.meta_value)) {
        const exists = await think._.find(JSON.parse(result.meta_value), ['id', userId.toString()])
        if (exists) {
          iView = true
          // post.like_date = exists.date
        }
        const list = JSON.parse(result.meta_value)
        totalCount = list.length
        for (const u of list) {
          let user = await userModel.where({id: Number(u.id)}).find()
          views.push(user)
        }
      }
    }

    _formatMeta(views)

    for (let user of views) {
      Reflect.deleteProperty(user, 'meta')
    }

    return this.success({
      found: totalCount,
      i_view: iView,
      post_id: post_id,
      views: views
    })
  }

  /**
   * New like
   * @returns {Promise.<*>}
   */
  async newAction () {
    const userId = this.ctx.state.user.id
    console.log(this.ctx.state)
    const id = this.get('id')
    // const id = postId
    let date = new Date().getTime()

    const postMeta = this.model('postmeta', {appId: this.appId})

    const result = await postMeta.where({
      post_id: id,
      meta_key: '_post_views'
    }).find()

    let viewCount = 0
    if (!think.isEmpty(result)) {
      if (!think.isEmpty(result.meta_value)) {
        viewCount = JSON.parse(result.meta_value).length
        const iView = await think._.find(JSON.parse(result.meta_value), ['id', userId.toString()])
        if (!iView) {
          await postMeta.newViewer(userId, id, this.ip)
          viewCount++
        } else {
          await postMeta.updateViewDate(userId, id, this.ip)
        }
      }
    } else {
      // 添加
      const res = await postMeta.add({
        post_id: id,
        meta_key: '_post_views',
        meta_value: ['exp', `JSON_ARRAY(JSON_OBJECT('id', '${userId}', 'ip', '${_ip2int(this.ip)}', 'date', '${date}'))`]
      })
      if (res > 0) {
        viewCount++
      }
    }
    return this.success({
      i_view: true,
      view_count: viewCount,
      post_id: id,
      date: date
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
      const data = await postMeta.getLikeStatus(userId, this.id)
      // if (!think.isEmpty(data.value_index))
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
        await this.model('users').unLike(userId, this.appId, this.id)
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
