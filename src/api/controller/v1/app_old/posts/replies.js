/* eslint-disable no-undef */
const tc = require('text-censor')

const BaseRest = require('../_rest.js');
module.exports = class extends BaseRest {

  /**
   * 查询全部 liked 用户
   * @returns {Promise.<void>}
   */
  async indexAction () {
    const post_id = this.get('id')
    const userId = this.ctx.state.user.userInfo.id
    const commentsModel = this.model('comments', {appId: this.appId})
    const fields = [
      'comment_id as id',
      'comment_post_id as post_id',
      'comment_author as author',
      'comment_author_ip as ip',
      'comment_date as date',
      'comment_content as content',
      'comment_parent as parent',
      'user_id'
    ]
    const data = await commentsModel.field(fields).where({
      comment_post_id: post_id
    }).select()
    const usersModel = this.model('users')

    for (let item of data) {
      item.author = await usersModel.where({id: item.user_id}).find()
      _formatOneMeta(item.author)
    }
    return this.success({
      found: data.length,
      // app_id
      comments: data
      // found: ,
      // i_like: iLike,
      // post_id: id,
      // likes: likes
    })

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
    const userInfo = this.ctx.state.user.userInfo
    const post_id = this.get('id')

    const data = this.post()
    // data.content
    const commentsModel = this.model('comments', {appId: this.appId})
    const postData = {
      user_id: userInfo.id,
      comment_post_id: post_id,
      // comment_author: data.author,
      comment_author: userInfo.id,
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
    return this.success({
      post: {
        id: post_id
      },
      author: userInfo,
      date: new Date().getTime(),
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
