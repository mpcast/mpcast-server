/* eslint-disable no-undef,no-return-await,default-case,max-depth,no-warning-comments */
const tc = require('text-censor')
const BaseRest = require('./Base')
let fields = [
  'id',
  'comment_post_id as post_id',
  'comment_author as author',
  'comment_author_ip as ip',
  'comment_date as date',
  'comment_content as content',
  'comment_parent as parent',
  'user_id'
]
module.exports = class extends BaseRest {

  // GET POST
  async indexAction () {
    if (this.isGet) {
      const action = this.get('action')
      if (!think.isEmpty(action)) {
        switch (action) {
          // 获取会话
          // return
          case 'tree': {
            console.log(action + '0------')
            return await this.tree()
            // break
            // const code = this.get('code')
            // if (!think.isEmpty(code)) {
            //   try {
            //     const token = await this.wxLogin(code);
            //     return this.success({token: token})
            //   } catch (e) {
            //     return this.fail(e)
            //   }
            // } else {
            //   return this.fail()
            // }
          }
          default: {
            break;
          }
        }
      }
      const comment_id = this.get('id')
      const usersModel = this.model('users')

      const commentModel = this.model('comments', {appId: this.appId})
      if (!think.isEmpty(comment_id)) {
        const data = await commentModel.field(fields).where({
          id: comment_id
        }).find()
        // data.post = await
        data.author = await usersModel.where({id: data.user_id}).find()
        _formatOneMeta(data.author)
        return this.success(data)
      } else {
        const data = await commentModel.field(fields).page(this.get('page'), 100).countSelect()
        const treeList = arr_to_tree(data.data, 0)
        const dest = think._.groupBy(treeList, 'post_id')
        return this.success(dest)
      }
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

  async tree () {
    const commentModel = this.model('comments', {appId: this.appId})
    const data = await commentModel.field(['id', 'comment_post_id as post_id', 'comment_parent as parent']).select()
    const treeList = arr_to_tree(data, 0)
    let dest = think._.groupBy(treeList, 'post_id')
    for (let key of Object.keys(dest)) {
      if (dest[key].length > 0) {
        for (let i of dest[key]) {
          console.log(i.id)
        }
        // for (let i = 0; i < dest[key]; i++) {
        //   console.log(dest[key][i].id)
        // }
      }
      // if (typeof dest[key] === 'Array') {
      //
      // }
      // console.log(JSON.stringify(dest[key]))
      // console.log(key + ": " + dest[key]);
    }
    return this.success(dest)
  }

}
