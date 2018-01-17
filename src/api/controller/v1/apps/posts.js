/* eslint-disable no-undef,no-return-await,default-case,max-depth,no-warning-comments,comma-spacing */
const BaseRest = require('./Base')
const slug = require('limax')

const fields = [
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
    // const data = await this.pageAll()
    // 格式旧数据用的
    const data = await this.getAllFromPage()
    return this.success(data)
  }
  /**
   * 统一处理查询参数
   * @returns {Promise<{}>}
   * @private
   */
  async _parseQuery () {
    const query = {}
    const title = this.get('title')
    if (!think.isEmpty(title)) {
      query.title = title
    }
    const author = this.get('author')
    if (!think.isEmpty(author)) {
      query.author = author
    }
    const status = this.get('status')
    if (think.isEmpty(status) || status === 'all') {
      query.status = ['NOT IN', 'trash']
    } else {
      query.status = status
    }
    query.parent = !think.isEmpty(this.get('parent')) ? this.get('parent') : 0
    query.type = !think.isEmpty(this.get('type')) ? this.get('type') : 'post_format'

    return query
  }
  /**
   * 分页查询全部内容
   * @returns {Promise<Array>}
   */
  async pageAll () {
    // 获取处理过的查询条件
    let query = await this._parseQuery()
    let list = []

    // 分类条件查询
    if (!think.isEmpty(this.get('category'))) {
      list = await this.getByCategory(this.get('category'))
    }
    // 置顶内容
    if (this.get('sticky') === 'true') {
      list = await this.getStickys()
    }

    // 默认条件下的分页内容
    list = await this.model('posts', {appId: this.appId})
      .where(query)
      .field(fields.join(","))
      .order('modified DESC')
      .page(this.get('page'), this.get('pagesize') ? this.get('pagesize') : 12)
      .countSelect()

    // 格式化全部 meta 数据
    _formatMeta(list.data)
    const metaModel = this.model('postmeta', {appId: this.appId})

    // 处理 meta 数据
    for (const item of list.data) {
      if (!Object.is(item.meta._items, undefined)) {
        item.items = item.meta._items
      }
      item.url = ''
      // 如果有音频
      /*
      if (!Object.is(item.meta._audio_id, undefined)) {
        // 音频播放地址
        item.url = await metaModel.getAttachment('file', item.meta._audio_id)
      }
      */
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
        // 清理 Author的 meta 数据
        Reflect.deleteProperty(item.author, 'meta')
      }
      // 清理 liked 信息
      if (think._.has(item.author, 'liked')) {
        Reflect.deleteProperty(item.author, 'liked')
      }
      item.like_count = await metaModel.getLikedCount(item.id)
      // 统计留言数据
      // const repliesCount = await this.model('comments', {appId: this.appId}).where({'comment_post_id': item.id}).count()
      // item.replies_count = repliesCount
      if (!Object.is(item.meta._thumbnail_id, undefined)) {
        item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
      } else {
          item.featured_image = this.getRandomCover()
      }

      // 清理 post 的 meta 数据
      if (think._.has(item, 'meta')) {
        Reflect.deleteProperty(item, 'meta')
      }
    }
    return list
  }

  /**
   * 获取置顶的推荐内容
   * @returns {Promise<void>}
   */
  async getStickys () {
    const stickys = this.options.stickys
    const list = await this.model('posts', {appId: this.appId})
      .getStickys(stickys)
    return list
  }

  /**
   * 获取按分类查询的内容
   * @returns {Promise<void>}
   */
  async getByCategory (category) {
    const list = await this.model('posts', {appId: this.appId})
      .findByCategory(category, this.get('page'), this.get('pagesize'))
    return list
  }

  /**
   * 按分页查询全部内容
   * @returns {Promise<Array>}
   */
  async getAllFromPage () {
    const query = {}
    const title = this.get('title')
    const author = this.get('author')
    if (!think.isEmpty(author)) {
      query.author = author
    }
    const status = this.get('status')
    if (think.isEmpty(status) || status === 'all') {
      query.status = ['NOT IN', 'trash']
    } else {
      query.status = status
    }
    query.parent = !think.isEmpty(this.get('parent')) ? this.get('parent') : 0
    query.type = !think.isEmpty(this.get('type')) ? this.get('type') : 'post_format'
    let list = []
    const category = this.get('category')
    if (!think.isEmpty(category)) {
      list = await this.model('posts', {appId: this.appId}).findByCategory(category, this.get('page'), 12)

    } else if (this.get('sticky') === 'true') {
      const stickys = this.options.stickys
      list = await this.model('posts', {appId: this.appId}).getStickys(stickys)

    } else {
      list = await this.model('posts', {appId: this.appId}).where(query).field(fields.join(",")).order('modified DESC').page(this.get('page'), this.get('pagesize') ? this.get('pagesize') : 30).countSelect()
    }
    _formatMeta(list.data)
    const metaModel = this.model('postmeta', {appId: this.appId})

    // if (!think.isEmpty(data.items)) {
    //   data.meta = {
    //     '_items': JSON.stringify(data.items)
    //   }
    //   await metaModel.save(this.id, data.meta)
    // }
    for (const item of list.data) {
      if (!Object.is(item.meta._items, undefined)) {
        item.items = item.meta._items
        // think._.reverse(item.items

      }
      // Reflect.deleteProperty(item.meta, '_items')

      // console.log(JSON.stringify(item.meta))
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

      const repliesCount = await this.model('comments', {appId: this.appId}).where({'comment_post_id': item.id}).count()
      // const user = this.ctx.state.user
      // item.author = user
      // 音频播放的歌词信息
      // lrc
      item.replies_count = repliesCount
      // 如果有封面 默认是 thumbnail 缩略图，如果是 podcast 就是封面特色图片 featured_image
      // if (!Object.is(item.meta['_featured_image']))
      if (!Object.is(item.meta._thumbnail_id, undefined)) {
        // item.thumbnail = {
        //   id: item.meta['_thumbnail_id']
        // }
        // item.thumbnail.url = await metaModel.getAttachment('file', item.meta['_thumbnail_id'])
        item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
        // item.thumbnal = await metaModel.getThumbnail({post_id: item.id})
      } else {
        item.featured_image = this.getRandomCover()
      }

      if (think._.has(item, 'meta')) {
        Reflect.deleteProperty(item, 'meta')
      }
    }
    return list
  }

  /**
   * 搜索主题关键词
   * @returns {Promise<void>}
   */
  async searchAction () {
    const title = this.get('param')
    const postModel = this.model('posts', {appId: this.appId})
    const list = await postModel.findByTitle(title, this.get('page'), this.get('pagesize'))
    const metaModel = this.model('postmeta', {appId: this.appId})
    _formatMeta(list.data)

    for (const item of list.data) {
      item.url = ''
      // 如果有封面 默认是 thumbnail 缩略图，如果是 podcast 就是封面特色图片 featured_image
      if (!Object.is(item.meta._thumbnail_id, undefined)) {
        item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
      } else {
        item.featured_image = this.getRandomCover()
      }
    }
    return this.success(list)
  }

  async newAction () {
    const data = this.post()
    if (think.isEmpty(data.title)) {
      return this.fail('主题不能为空')
    }
    data.title = think.tc.filter(data.title)
    const slugName = slug(data.title, {tone: false, separateNumbers: false})
    if (think.isEmpty(slugName)) {
      return this.fail('创建失败，请检查主题内容')
    }
    if (!think.isEmpty(data.content)) {
      data.content = think.tc.filter(data.content)
    }
    data.name = slugName

    const postModel = this.model('posts', {appId: this.appId})
    const res = await postModel.findByName(slugName)
    if (!think.isEmpty(res)) {
      return this.success(res)
    }
    if (think.isEmpty(data.type)) {
      data.type = 'post_format'
    }
    const currentTime = new Date().getTime();
    data.date = currentTime
    data.modified = currentTime
    if (think.isEmpty(data.author)) {
      data.author = this.ctx.state.user.id
    }
    if (think.isEmpty(data.status)) {
      data.status = 'auto-draft';
    }
    const postId = await this.modelInstance.add(data)
    // 2 更新 meta 数据
    if (!Object.is(data.meta, undefined)) {
      const metaModel = this.model('postmeta', {appId: this.appId})
      // 保存 meta 信息
      await metaModel.save(postId, data.meta)
    }
    // 3 添加内容与 term 分类之间的关联
    // term_taxonomy_id
    const defaultTerm = Number(this.options.default.term)

    let categories = []
    if (Object.is(data.categories, undefined) && think.isEmpty(data.categories)) {
      categories = categories.concat(defaultTerm)
    } else {
      // 处理提交过来的分类信息，可能是单分类 id 也可能是数组, 分类 id 为 term_taxonomy_id
      categories = categories.concat(JSON.parse(data.categories))
    }
    // 4 获取内容的格式类别
    if (!Object.is(data.format, undefined) && !think.isEmpty(data.format)) {
      categories = categories.concat(data.format)
    }
    for (const cate of categories) {
      await this.model('taxonomy', {appId: this.appId}).relationships(postId, cate)
    }
    // 5 如果有关联信息，更新关联对象信息
    if (!Object.is(data.relateTo, undefined) && !think.isEmpty(data.relateTo)) {
      const metaModel = this.model('postmeta', {appId: this.appId})
      // 保存关联对象的 meta 信息
      await metaModel.related(data.relateTo, postId, data.relateStatus)
    }
    const isDefaultPost = think._.findLast(categories, (value) => {
      return defaultTerm === value
    })

    // console.log(isDefaultPost + 'x0009sad9fasifasidfpoiasp')
    if (isDefaultPost) {
      // 6 添加 Love(like) 信息
      await this.newLike(postId)
    }
    const newPost = await this.getPost(postId)
    return this.success(newPost)
  }

  async newLike (postId) {
    const userId = this.ctx.state.user.id
    const id = postId
    let date = this.post('love_date')
    // 日期是要检查 的
    if (!think.isEmpty(date)) {
      // 验证日期的正确性
      const d = new Date(date).getFullYear()
      // const d = getMonthFormatted(new Date(date).getMonth())
      if (d === 'NaN') {
        return this.fail('日期格式错误')
      }
    } else {
      date = new Date().getFullYear()
    }
    const postMeta = this.model('postmeta', {appId: this.appId})

    const result = await postMeta.where({
      post_id: id,
      meta_key: '_liked'
    }).find()

    let likeCount = 0
    if (!think.isEmpty(result)) {
      if (!think.isEmpty(result.meta_value)) {
        likeCount = JSON.parse(result.meta_value).length
        const iLike = await think._.find(JSON.parse(result.meta_value), ['id', userId.toString()])
        if (!iLike) {
          await postMeta.newLike(userId, id, this.ip, date)
          likeCount++
        } else {
          await postMeta.updateLikeDate(userId, id, date)
        }
      }
    } else {
      // 添加
      const res = await postMeta.add({
        post_id: id,
        meta_key: '_liked',
        meta_value: ['exp', `JSON_ARRAY(JSON_OBJECT('id', '${userId}', 'ip', '${_ip2int(this.ip)}', 'date', '${date}', 'modified', '${new Date().getTime()}'))`]
      })
      if (res > 0) {
        likeCount++
      }
    }
    await this.model('users').newLike(userId, this.appId, id, date)
  }
  async getPost (post_id) {
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
    ];
    fields = unique(fields);

    let query = {}
    query.id = post_id
    query = {status: ['NOT IN', 'trash'], id: post_id}

    const list = await this.model('posts', {appId: this.appId}).where(query).field(fields.join(",")).order('sort ASC').page(this.get('page'), 10).countSelect()

    // 处理播放列表音频 Meta 信息
    _formatMeta(list.data)

    // 根据 Meta 信息中的音频附件 id 查询出音频地址
    const metaModel = this.model('postmeta', {appId: this.appId})
    for (const item of list.data) {
      item.url = ''
      // 如果有音频
      if (!Object.is(item.meta._audio_id, undefined)) {
        // 音频播放地址
        item.url = await metaModel.getAttachment('file', item.meta._audio_id)
      }
      const userModel = this.model('users');

      // 如果有作者信息
      if (!Object.is(item.meta._author_id, undefined)) {
        const author = await userModel.where({id: item.meta._author_id}).find()
        _formatOneMeta(author)
        item.authorInfo = author
        // 查询 出对应的作者信息
      } else {
        const author = await userModel.where({id: item.author}).find()
        _formatOneMeta(author)
        item.authorInfo = author

      }
      // 取得头像地址
      if (!Object.is(item.authorInfo.meta.avatar, undefined)) {
        item.authorInfo.avatar = await this.model('postmeta').getAttachment('file', item.authorInfo.meta.avatar)
      }

      // 音频播放的歌词信息
      // lrc

      // 如果有封面 默认是 thumbnail 缩略图，如果是 podcast 就是封面特色图片 featured_image
      // if (!Object.is(item.meta['_featured_image']))
      if (!Object.is(item.meta._thumbnail_id, undefined)) {
        // item.thumbnail = {
        //   id: item.meta['_thumbnail_id']
        // }
        // item.thumbnail.url = await metaModel.getAttachment('file', item.meta['_thumbnail_id'])
        item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
        // item.thumbnal = await metaModel.getThumbnail({post_id: item.id})
      }

      // 获取内容的分类信息
      // const terms = await this.model('taxonomy', {appId: this.appId}).getTermsByObject(query.id)
      // console.log(JSON.stringify(terms))
    }
    // 处理分类及内容层级
    await this.dealTerms(list)
    // 处理标签信息
    await this.dealTags(list)

    await this.dealLikes(list.data[0])

    return list.data[0]
  }

  /**
   * 处理分类信息，为查询的结果添加分类信息
   * @param list
   * @returns {Promise.<*>}
   */
  async dealTerms (list) {
    const _taxonomy = this.model('taxonomy', {appId: this.appId})
    for (const item of list.data) {
      item.categories = await _taxonomy.findCategoriesByObject(item.id)
    }
    // 处理内容层级
    // let treeList = await arr_to_tree(list.data, 0);
    list.data = await arr_to_tree(list.data, 0);

    return list
  }

  /**
   * 处理内容标签信息
   * @param list
   * @returns {Promise.<void>}
   */
  async dealTags (list) {
    const _taxonomy = this.model('taxonomy', {appId: this.appId})
    for (const item of list.data) {
      item.tags = await _taxonomy.findTagsByObject(item.id)
    }
  }

  // async
  /**
   * 处理内容喜欢的信息
   * @param post
   * @returns {Promise.<void>}
   */
  async dealLikes (post) {
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
        const exists = await think._.find(JSON.parse(result.meta_value), ['id', userId])
        if (exists) {
          iLike = true
        }
        const list = JSON.parse(result.meta_value)
        totalCount = list.length
        for (const u of list) {
          const user = await userModel.where({id: u.id}).find()
          _formatOneMeta(user)
          likes.push(user)
        }
      }
    }

    post.like_count = totalCount
    post.i_like = iLike
    post.likes = likes
  }

}
