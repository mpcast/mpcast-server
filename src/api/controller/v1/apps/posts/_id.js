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
    const postModel = this.model('posts', {appId: this.appId})

    if (this.isPost) {
      if (!this.id) {
        return this.fail(400, 'params error');
      }
      // if (this.post('sticky')) {}
      const action = this.get('action')
      // 单独更新作者信息
      if (!think.isEmpty(action) && action === 'change-author') {
        return await this.changeAuthor()
      }

      const data = this.post()
      if (think._.has(data, 'sticky')) {
        if (data.sticky === true) {
          await this.model('options', {appId: this.appId}).addSticky(this.id.toString())
        }
        if (data.sticky === false) {
          await this.model('options', {appId: this.appId}).removeSticky(this.id.toString())
        }
      }

      // if (think.isEmpty(data.type)) {
      //   data.type = 'post_format'
      // }

      if (!think.isEmpty(data.block)) {
        data.block = JSON.stringify(data.block)
      }
      const currentTime = new Date().getTime();
      data.modified = currentTime

      if (think.isEmpty(data.author)) {
        data.author = this.ctx.state.user.id
      }
      const metaModel = await this.model('postmeta', {appId: this.appId})

      await this.model('posts', {appId: this.appId})
        .setRelation(false)
        .where({id: this.id})
        .update(data);
      // 2 更新 meta 数据
      if (!Object.is(data.meta, undefined)) {
        // 保存 meta 信息
        await metaModel.save(this.id, data.meta)
      }
      const defaultTerm = this.options.default.term
      // 如果这里也更新 就会删除分类的关联，所以是错误的
      // let categories = []
      if (!Object.is(data.categories, undefined) && !think.isEmpty(data.categories)) {
        const curCategories = await this.model('taxonomy', {appId: this.appId}).findCategoriesByObject(this.id.toString())
        const xors = think._.xor(think._.map(curCategories, 'term_id'), data.categories)
        // 没有添加，有就删除
        // categories = categories.concat(data.categories)
        for (const cate of xors) {
          await this.model('taxonomy', {appId: this.appId}).relationships(this.id, cate)
        }
      }

      // 为了兼容更新返回完整数据的 API
      if (this.get('model') === 'full') {
        const newData = await this.getPost(this.id)

        await this.decoratorData(newData)
        return this.success(newData)
      }
      return this.success()
    }
    if (this.isGet) {
      const postId = this.get('id')
      if (!think.isEmpty(postId)) {
        let data = await postModel.getById(postId)
        // console.log(data)
        // data = await this.decoratorData(data)
        await this._decoratorAuthor(data)
        switch (data.type) {
          case 'page': {
            data = await this._pageData(data)
            break
          }
          case 'post_format': {
            data = await this._formatData(data)
            break
          }
          default:
            break
        }
        // 返回一条数据
        return this.success(data)
      }
    }
    return this.success()
  }

  async decoratorData(data) {
    await this._decoratorAuthor(data)
    switch (data.type) {
      case 'page': {
        data = await this._pageData(data)
        break
      }
      case 'post_format': {
        data = await this._formatData(data)
        break
      }
      default:
        break
    }
    return data
  }
  /**
   * 装饰作者
   * @param data
   * @returns {Promise<void>}
   * @private
   */
  async _decoratorAuthor (data) {
    const metaModel = this.model('postmeta', {appId: this.appId})
    const userModel = this.model('users')

    _formatOneMeta(data)
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

    // 如果有封面 默认是 thumbnail 缩略图，如果是 podcast 就是封面特色图片 featured_image
    // if (!Object.is(item.meta['_featured_image']))
    if (!Object.is(data.meta._thumbnail_id, undefined)) {
      data.featured_image = await metaModel.getAttachment('file', data.meta._thumbnail_id)
    }

    if (think.isEmpty(data.block)) {
      data.block = []
    }
    data.author = user
    Reflect.deleteProperty(user, 'meta')
  }
  /**
   * 更新作者
   * @returns {Promise<*>}
   */
  async changeAuthor () {
    const res = await this.model('posts', {appId: this.appId})
      .setRelation(false)
      .where({id: this.id}).update({
        author: this.post('author')
      })
    if (res > 0) {
      return this.success()
    } else {
      return this.error('更新失败')
    }
  }

  async _formatData (data) {
    const postModel = this.model('posts', {appId: this.appId})
    await this._decoratorTerms(data)
    data = await postModel.getFormatData(data)
    return data
  }
  /**
   * 获取内容
   * @param post_id
   * @returns {Promise<*>}
   */
  async _pageData (data) {
    // 获取精选内容列表
    const stickies = this.options.stickys
    // const postModel = this.model('posts', {appId: this.appId})


    // 根据 id 取内容
    // let data = await postModel.getById(postId)

    // console.log(data.type)
    // const laal = await postModel.dealFormat(data)
    // console.log(laal)
    const isSticky = think._.find(stickies, (id) => {
      return data.id.toString() === id
    })

    if (isSticky) {
      data.sticky = true
    } else {
      data.sticky = false
    }

    // 清除 meta

    // 处理分类及内容层级
    // await this._dealTerms(data)
    // 装饰类别与 format 信息
    // await this._decoratorTerms(data)
    // await this._decoratorTerms(data)

    // 处理标签信息
    await this._dealTags(data)
    //
    await this._detalBlock(data)
    //
    // await this._dealLikes(data)

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
  async _decoratorTerms (post) {
    const _taxonomy = this.model('taxonomy', {appId: this.appId})
    post.categories = await _taxonomy.findCategoriesByObject(post.id.toString())
    post.categories = think._.map(post.categories, 'term_taxonomy_id')
    const postFormat = await _taxonomy.getFormat(post.id)
    if (!think.isEmpty(postFormat)) {
      post.type = postFormat.slug
    }

    return post
  }

  async _detalBlock (post) {
    if (!think.isEmpty(post.block)) {
      const blockList = await this.model('posts', {appId: this.appId})
        .loadBlock(post.type, JSON.parse(post.block))
      post.block = blockList
    }
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
