/* eslint-disable no-undef,no-return-await,default-case,max-depth,no-warning-comments */
const BaseRest = require('../Base')
let fields = [
  'id',
  'author',
  'status',
  'type',
  'title',
  'name',
  'content',
  'sort',
  'excerpt',
  'date',
  'modified',
  'parent'
]
module.exports = class extends BaseRest {
  async indexAction () {
    if (this.isGet) {
      const postModel = this.model('posts', {appId: this.appId})
      const postId = this.get('id')
      const format = this.get('format')
      if (format === 'post-format-audio') {
        let data = await postModel.getFormatAssets(postId, format)
        return this.success(data)
        // const audios = await this.model('posts', {appId: this.appId})
        //   .getAudios(think._.map(post.meta._audio_list, 'id'))
        // post.audios = audios
      }
      let data = await postModel.getAssets(postId, this.get('page'), this.get('pagesize') || 12)
      return this.success(data)
    }
  }

  async assetsAction () {
    if (this.isGet) {
      const postId = this.get('id')
      return this.success('assets' + postId)
    }
  }
  async getPost (post_id) {
    const postModel = this.model('posts', {appId: this.appId})
    const metaModel = this.model('postmeta', {appId: this.appId})
    const userModel = this.model('users');

    let data = await postModel.getById(post_id)

    _formatOneMeta(data)
    data.url = ''
    // 处理音频
    if (!Object.is(data.meta._audio_id, undefined)) {
      // 音频播放地址
      data.url = await metaModel.getAttachment('file', item.meta._audio_id)
    }
    // 处理作者信息
    let user = await userModel.getById(data.author)
    _formatOneMeta(user)

    // 获取头像地址
    if (!think.isEmpty(user.meta[`picker_${this.appId}_wechat`])) {
      user.avatarUrl = user.meta[`picker_${this.appId}_wechat`].avatarUrl
    } else {
      user.avatarUrl = await this.model('postmeta').getAttachment('file', user.meta.avatar)
    }

    // 作者简历
    if (!Object.is(user.meta.resume, undefined)) {
      user.resume = user.meta.resume
    }
    if (!Object.is(data.meta._assets, undefined)) {
      data.assets = data.meta._assets
    }

    // 如果有封面 默认是 thumbnail 缩略图，如果是 podcast 就是封面特色图片 featured_image
    // if (!Object.is(item.meta['_featured_image']))
    if (!Object.is(data.meta._thumbnail_id, undefined)) {
      data.featured_image = await metaModel.getAttachment('file', data.meta._thumbnail_id)
    }


    Reflect.deleteProperty(user, 'meta')
    data.author = user
    // 清除 meta
    Reflect.deleteProperty(data, 'meta')

    // 处理分类及内容层级
    await this._dealTerms(data)
    // 处理标签信息
    await this._dealTags(data)

    await this._dealLikes(data)

    return data

  }

  //
  // Private methods
  //
  /**
   * 处理分类信息，为查询的结果添加分类信息
   * @param post
   * @returns {Promise.<*>}
   */
  async _dealTerms (post) {
    const _taxonomy = this.model('taxonomy', {appId: this.appId})
    post.categories = await _taxonomy.findCategoriesByObject(post.id.toString())
    return post

    // 处理内容层级
    // let treeList = await arr_to_tree(list.data, 0);
    // list.data = await arr_to_tree(list.data, 0);
    //
    // return list
  }

  /**
   * 处理内容标签信息
   * @param post
   * @returns {Promise.<void>}
   */
  async _dealTags (post) {
    const _taxonomy = this.model('taxonomy', {appId: this.appId})
    post.tags = await _taxonomy.findTagsByObject(post.id)
  }

  /**
   * 处理内容喜欢的信息
   * @param post
   * @returns {Promise.<void>}
   */
  async _dealLikes (post) {
    const userId = this.ctx.state.user.id
    const postMeta = this.model('postmeta', {appId: this.appId})

    const result = await postMeta.where({
      post_id: post.id,
      meta_key: '_liked'
    }).find()
    // 当前登录用户是否喜欢
    let iLike = false
    const likes = []
    const userModel = this.model('users')
    let totalCount = 0
    if (!think.isEmpty(result)) {
      if (!think.isEmpty(result.meta_value)) {
        const exists = await think._.find(JSON.parse(result.meta_value), ['id', userId.toString()])
        if (exists) {
          iLike = true
          post.like_date = exists.date
        }
        const list = JSON.parse(result.meta_value)
        totalCount = list.length
        for (const u of list) {
          let user = await userModel.where({id: u.id}).find()
          likes.push(user)
        }
      }
    }

    _formatMeta(likes)

    for (let user of likes) {
      Reflect.deleteProperty(user, 'meta')
    }
    post.like_count = totalCount
    post.i_like = iLike
    post.likes = likes
  }

  /**
   * 删除分类
   * @returns {Promise.<*>}
   */
  async deleteAction () {
    const postId = this.get('id')
    const currentUserId = this.ctx.state.user.id

    if (think.isEmpty(postId)) {
      return this.fail('提交的参数错误')
    }
    const postsModel = this.model('posts', {appId: this.appId})
    const data = await postsModel.where({id: postId}).find()
    if (think.isEmpty(data)) {
      return this.fail('内容不存在!')
    }
    // if (data.author !== currentUserId) {
    //   return this.fail('没有此内容的操作权限!')
    // }
    try {
      await this.model('posts', {appId: this.appId})
        .where({id: postId, author: currentUserId})
        .update({status: 'trash'})
      return this.success('删除成功')
    } catch (e) {
      return this.fail('删除失败')
    }
  }

}
