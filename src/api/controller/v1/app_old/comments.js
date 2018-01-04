/* eslint-disable no-undef,no-return-await,default-case,max-depth,no-warning-comments */
const tc = require('text-censor')
const BaseRest = require('./_rest')
module.exports = class extends BaseRest {

  // GET POST
  async indexAction () {
    if (this.isGet) {
      const comment_id = this.get('id')

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
      const usersModel = this.model('users')


      const commentModel = this.model('comments', {appId: this.appId})
      const data = await commentModel.field(fields).where({
        comment_id: comment_id
      }).find()

      data.author = await usersModel.where({id: data.user_id}).find()
      _formatOneMeta(data.author)
      return this.success(data)
    }

    // 修改
    if (this.isPost) {
      const userInfo = this.ctx.state.user.userInfo
      const comment_id = this.get('id')
      let data = this.post()

      // data.content
      const commentsModel = this.model('comments', {appId: this.appId})
      const postData = {
        comment_date: new Date().getTime(),
        comment_content: tc.filter(data.content),
        comment_parent: data.parent,
        comment_type: 'comment',
        comment_approved: 'approved'
      }
      await commentsModel.where({
        comment_id: comment_id
      }).update(postData)
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
  }
}
