/* eslint-disable no-undef */
const tc = require('text-censor')

const BaseRest = require('../Base');
module.exports = class extends BaseRest {

  /**
   * 查询全部 评论的内容
   * @returns {Promise.<void>}
   */
  async indexAction () {
    const post_id = this.get('id')
    const userId = this.ctx.state.user.id
    const commentsModel = this.model('comments', {appId: this.appId})
    const fields = [
      'comment_post_id as post_id',
      'comment_author as author',
      'comment_author_ip as ip',
      'comment_date as date',
      'comment_content as content',
      'comment_parent as parent',
      'user_id'
    ]
    const list = await commentsModel.field(fields).where({
      comment_post_id: post_id
    }).order('date DESC').page(this.get('page'), 20).countSelect()
    const usersModel = this.model('users')

    for (let item of list.data) {
      // item.author = await usersModel.where({id: item.user_id}).find()
      item.author = await usersModel.getById(item.user_id)
      _formatOneMeta(item.author)
      item.date = this.ctx.moment(item.date).fromNow()
      // 取得头像地址
      if (!think.isEmpty(item.author.meta[`picker_${this.appId}_wechat`])) {
        item.author.avatar = item.author.meta[`picker_${this.appId}_wechat`].avatarUrl
        // user.type = 'wechat'
      }
      Reflect.deleteProperty(item.author, 'meta')
    }
    return this.success(list)

    // exp.
    // {
    //   "ID": 288,
    //   "post": {
    //   "ID": 7,
    //     "title": "So should we be, like, blogging and stuff too?",
    //     "type": "post",
    // },
    //   "author": {
    //   "ID": 3742,
    //     "login": "vtymkin",
    //     "email": false,
    //     "name": "Vashti",
    //     "first_name": "Vashti",
    //     "last_name": "Tymkin",
    //     "nice_name": "vtymkin",
    //     "URL": "http:\/\/learningmorestuff.wordpress.com",
    //     "avatar_URL": "https:\/\/2.gravatar.com\/avatar\/b551bd04cc12ee09d2859e235d38a897?s=96&d=retro",
    //     "profile_URL": "https:\/\/en.gravatar.com\/vtymkin",
    //     "ip_address": false,
    //     "site_ID": 73927561
    // },
    //   "date": "2005-12-13T03:40:15+00:00",
    //   "URL": "http:\/\/en.blog.wordpress.com\/2005\/09\/26\/blogging-and-stuff\/#comment-288",
    //   "short_URL": "https:\/\/wp.me\/pf2B5-7%23comment-288",
    //   "content": "<p>Super. Well done you guys! \ud83d\ude1b<\/p>\n",
    //   "raw_content": "Super. Well done you guys! :-P",
    //   "status": "approved",
    //   "parent": false,
    //   "type": "comment",
    //   "like_count": 0,
    //   "i_like": false,
    //   "meta": {
    //   "links": {
    //   }
    // }
    // }
  }
  /**
   * New like
   * @returns {Promise.<*>}
   */
  async newAction () {
    const curUser = this.ctx.state.user
    console.log(JSON.stringify(curUser))
    const post_id = this.get('id')

    const data = this.post()
    // data.content
    const commentsModel = this.model('comments', {appId: this.appId})
    const postData = {
      user_id: curUser.id,
      comment_post_id: post_id,
      // comment_author: data.author,
      comment_author: curUser.id,
      comment_author_email: data.email,
      comment_author_url: data.url,
      comment_author_ip: _ip2int(this.ip),
      comment_date: new Date().getTime(),
      comment_content: tc.filter(data.content),
      comment_parent: data.parent,
      comment_type: 'comment',
      comment_approved: 'approved'
    }
    await commentsModel.add(postData)
    let author = await this.model('users').getById(curUser.id)
    _formatOneMeta(author)
    // 取得头像地址
    if (!think.isEmpty(author.meta[`picker_${this.appId}_wechat`])) {
      author.avatar = author.meta[`picker_${this.appId}_wechat`].avatarUrl
      // user.type = 'wechat'
    }
    Reflect.deleteProperty(author, 'meta')

    return this.success({
      post_id: post_id,
      // post: {
      //   id: post_id
      // },
      author: author,
      date: this.ctx.moment(new Date().getTime()).fromNow(),
      content: postData.comment_content,
      status: postData.comment_approved,
      type: postData.comment_type,
      like_count: 0,
      i_like: false,
      meta: {}
    })
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
