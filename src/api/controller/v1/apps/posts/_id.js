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
    if (this.isPost) {
      if (!this.id) {
        return this.fail(400, 'params error');
      }
      const action = this.get('action')
      if (!think.isEmpty(action) && action === 'change-author') {
        const res = await this.model('posts', {appId: this.appId}).setRelation(false).where({id: this.id}).update({
          author: this.post('author')
        })
        if (res > 0) {
          // console.log(res)
          return this.success()
        } else {
          return this.error('更新失败')
        }
      }
      const data = this.post()
      if (think.isEmpty(data.type)) {
        data.type = 'post_format'
      }
      const currentTime = new Date().getTime();
      // data.date = currentTime
      data.modified = currentTime
      if (think.isEmpty(data.author)) {
        data.author = this.ctx.state.user.id
      }
      const metaModel = await this.model('postmeta', {appId: this.appId})

      // if data.itemStatus === 'delete' 从数组中 remove 并返回完整的数组
      if (!think.isEmpty(data.item_id)) {
        if (data.item_status === 'delete') {
          const res = await metaModel.removeItem(this.id, data.item_id)
          await this.model('posts', {appId: this.appId}).where({id: data.item_id}).update({status: 'trash'});

          return this.success(res)
          // const newData = await this.getPost(this.id)
          // return this.success(newData)
        }
        // 更新 relate item
        const res = await metaModel.changeItemStatus(this.id, data.item_id, data.item_status)
        // 更新 item 状态
        return this.success(res)
      }
      // if (think.isEmpty(data.status)) {
      //   data.status = 'auto-draft';
      // }
      // const postId = await this.modelInstance.add(data)
      await this.model('posts', {appId: this.appId}).where({id: this.id}).update(data);
      // 2 更新 meta 数据
      if (!Object.is(data.meta, undefined)) {
        // 保存 meta 信息
        await metaModel.save(this.id, data.meta)
      }
      if (!think.isEmpty(data.items)) {
        data.meta = {
          '_items': JSON.stringify(data.items)

        }
        await metaModel.save(this.id, data.meta)
      }
      // 3 添加内容与 term 分类之间的关联
      // term_taxonomy_id
      // const defaultTerm = this.options.default.term
      // 如果这里也更新 就会删除分类的关联，所以是错误的
      let categories = []
      if (!Object.is(data.categories, undefined) && !think.isEmpty(data.categories)) {
        categories = categories.concat(JSON.parse(data.categories))
      }

      for (const cate of categories) {
        await this.model('taxonomy', {appId: this.appId}).relationships(this.id, cate)
      }
      const newData = await this.getPost(this.id)
      return this.success(newData)
    }
    if (this.isGet) {
      const post_id = this.get('id')
      if (!think.isEmpty(post_id)) {
        const data = await this.getPost(post_id)
        // 返回一条数据
        return this.success(data)
      }
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


    data.author = user
    // 清除 meta

    // 处理分类及内容层级
    await this._dealTerms(data)
    // 处理标签信息
    await this._dealTags(data)

    await this._dealLikes(data)

    Reflect.deleteProperty(user, 'meta')
    Reflect.deleteProperty(data, 'meta')

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
    const postFormat = await _taxonomy.getFormat(post.id)
    if (!think.isEmpty(postFormat)) {
      post.format = postFormat.slug
    }
    post.assets = think._.map(post.meta._assets)
    /*
    if (post.format === 'post-format-audio') {
      const audios = await this.model('posts', {appId: this.appId})
        .getAudios(think._.map(post.meta._audio_list, 'id'))
      post.audios = audios
    }*/
    return post
  }


  /**
   * 处理内容格式
   * @param list
   * @returns {Promise.<*>}
   */
  async formatData (data) {
    const _taxonomy = this.model('taxonomy', {appId: this.appId})
    for (const item of data) {
      item.format = await _taxonomy.getFormat(item.id)
    }
    // 处理内容层级
    // let treeList = await arr_to_tree(list.data, 0);
    // data = await arr_to_tree(data, 0);

    return data
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
