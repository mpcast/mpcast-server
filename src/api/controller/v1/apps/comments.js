/* eslint-disable no-undef,no-return-await,default-case,max-depth,no-warning-comments */
const tc = require('text-censor')
const BaseRest = require('./Base')
let fields = [
  'id',
  'comment_post_id',
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
        const data = await commentModel.getList(this.get('page'), this.get('pageSize'))
        // const data = await commentModel.field(fields).page(this.get('page'), 10).countSelect()
        // const treeList = arr_to_tree(data.data, 0)
        // const dest = think._.groupBy(treeList, 'post_id')
        // return this.success(dest)
        return this.success(data.data)
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
          // console.log(i.id)
        }
        // for (let i = 0; i < dest[key]; i++) {
        // }
      }
      // if (typeof dest[key] === 'Array') {
      //
      // }
    }
    return this.success(dest)
  }
  async _dealData (data) {
    _formatMeta(data)
    const metaModel = this.model('postmeta', {appId: this.appId})

    for (let item of data) {
      if (!Object.is(item.meta._items, undefined)) {
        item.items = item.meta._items
      }

      item.url = ''
      // 如果有音频
      if (!Object.is(item.meta._audio_id, undefined)) {
        // 音频播放地址
        item.url = await metaModel.getAttachment('file', item.meta._audio_id)
      }

      const userModel = this.model('users');

      // 作者信息
      item.author = await userModel.getById(item.author)
      _formatOneMeta(item.author)
      if (think._.has(item.author, 'meta')) {
        if (!Object.is(item.author.meta[`picker_${this.appId}_wechat`], undefined)) {
          item.author.avatar = item.author.meta[`picker_${this.appId}_wechat`].avatarUrl
        } else {
          item.author.avatar = await this.model('postmeta').getAttachment('file', item.author.meta.avatar)
        }
        Reflect.deleteProperty(item.author, 'meta')
      }
      if (think._.has(item.author, 'liked')) {
        Reflect.deleteProperty(item.author, 'liked')
      }
      item.like_count = await metaModel.getLikedCount(item.id)
      item.view_count = await metaModel.getViewCount(item.id)
      const repliesCount = await this.model('comments', {appId: this.appId}).where({'comment_post_id': item.id}).count()
      // const user = this.ctx.state.user
      // item.author = user
      // 音频播放的歌词信息
      // lrc
      item.replies_count = repliesCount
      // 如果有封面 默认是 thumbnail 缩略图，如果是 podcast 就是封面特色图片 featured_image
      // if (!Object.is(item.meta['_featured_image']))
      if (!Object.is(item.meta._thumbnail_id, undefined) && !think.isEmpty(item.meta._thumbnail_id)) {
        // item.thumbnail = {
        //   id: item.meta['_thumbnail_id']
        // }
        // item.thumbnail.url = await metaModel.getAttachment('file', item.meta['_thumbnail_id'])
        item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
        if (think.isEmpty(item.featured_image)) {
          item.featured_image = this.getRandomCover()
        }
        // item.thumbnal = await metaModel.getThumbnail({post_id: item.id})
      } else {
        item.featured_image = this.getRandomCover()
      }
    }
  }

}
