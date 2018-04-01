/* eslint-disable no-undef,no-return-await,default-case,max-depth,no-warning-comments,comma-spacing */
const BaseRest = require('./Base')
let fields = [
  'id',
  'author',
  'status',
  'type',
  'title',
  'name',
  'content',
  'excerpt',
  'date',
  'modified',
  'parent'
]
module.exports = class extends BaseRest {
  async indexAction () {
    const data = await this.getAllFromPage()
    return this.success(data)
  }

  async getAction () {
    const format = this.get('format')
    const termId = this.get('term_id')
    const termSlug = this.get('term_slug')

    if (!think.isEmpty(termSlug)) {
      // 根据 slug 取 termId
      const term = await this.model('taxonomy', {appId: this.appId}).getTermBySlug(termSlug)
      if (!think.isEmpty(term)) {
        const objects = await this.getObjectsInTerms(term.id)
        return this.success(objects)
      } else {
        return this.success()
      }
    }
    // 查询内容按分类 id 为首页使用 查询 6 条
    if (!think.isEmpty(termId)) {
      const objects = await this.getObjectsInTermsByLimit(termId)
      return this.success(objects)
    }

    // 查询全部分类按分类方法
    const taxonomy = this.get('term')
    if (!think.isEmpty(taxonomy)) {
      const terms = await this.model('taxonomy', {appId: this.appId}).getTerms(taxonomy)
      let cates = []
      terms.forEach((value) => {
        cates.push(value.id)
      })
      const objects = await this.getObjectsInTerms(cates, this.get('page'))
      return this.success(objects)
    }

    const id = this.get('id')
    if (!think.isEmpty(id)) {
      let fields = [
        'id',
        'author',
        'status',
        'type',
        'title',
        'name',
        'content',
        'excerpt',
        'date',
        'modified',
        'parent'
      ];
      fields = unique(fields);

      let query = {}
      query.id = id
      query = {status: ['NOT IN', 'trash'], id: id}
      return await this.getPodcast(query, fields)
    }

    const parent = this.get('parent')
    let query = {}
    if (!think.isEmpty(parent)) {
      query.parent = parent
      query.status = ['NOT IN', 'trash']
      const status = this.get('status')

      if (!think.isEmpty(status)) {
        query.status = status
        if (query.status === 'my') {
          // query.status = ['NOT IN', 'trash']
          query.author = this.ctx.state.user.id
        }
        if (query.status === 'drafts') {
          query.status = ['like', '%draft%']
        }
      }
      return await this.getPodcastList(query, fields)
    }

    const data = await this.getAllFromPage()
    return this.success(data)
  }

  /**
   * 按分类查找
   * @param termIds
   * @param page
   * @returns {Promise.<Object>}
   */
  async getObjectsInTerms (termIds, page) {
    const userId = this.ctx.state.user.id
    const _post = this.model('posts', {appId: this.appId})
    const data = await _post.getList(termIds, page, this.get('status'))
    if (!think.isEmpty(data)) {
      const metaModel = this.model('postmeta', {appId: this.appId})
      _formatMeta(data.data)

      for (const item of data.data) {
        item.url = ''
        const userModel = this.model('users');
        // 如果有作者信息
        if (!Object.is(item.meta._author_id, undefined)) {
          const authorInfo = await userModel.where({id: item.meta._author_id}).find()
          item.authorInfo = authorInfo
          // 查询 出对应的作者信息
        } else {
          item.authorInfo = await userModel.where({id: item.author}).find()
        }
        _formatOneMeta(item.authorInfo)
        if (item.authorInfo.hasOwnProperty('meta')) {
          if (item.authorInfo.meta.hasOwnProperty('avatar')) {
            item.authorInfo.avatar = await metaModel.getAttachment('file', item.authorInfo.meta.avatar)
          }
        }
        // TODO: @basil 1030这部分数据需要处理，减少 SQL 查询
        // "likes_enabled": true,
        //   "sharing_enabled": true,
        // 获取收藏/喜欢 的数量
        item.like_count = await metaModel.getLikedCount(item.id)
        // 获取当前用户是否喜欢
        const iLike = await metaModel.getLikeStatus(userId, item.id)
        item.i_like = iLike.contain > 0
        item.likes_enabled = true
        item.sharing_enabled = true
        // 如果有封面 默认是 thumbnail 缩略图，如果是 podcast 就是封面特色图片 featured_image
        if (!Object.is(item.meta._thumbnail_id, undefined)) {
          item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
        }
      }
      return data
    }
    // }
    // return data
    // return this.success(data)
    // const query = {
    //   status: ['NOT IN', 'trash']
    // }
    // let status = ['NOT IN', 'trash']
    // if (!think.isEmpty(this.get('status'))) {
    //   status = 'publish'
    // }
    // const taxonomyModel = this.model('taxonomy', {appId: this.appId})
    // const objects = await taxonomyModel.getObjectsInTermsByPage(termIds, page, this.get('pagesize'))
    // if (!think.isEmpty(objects) && objects.ids.length > 0) {
    //   const postsModel = this.model('posts', {appId: this.appId})
    //   const podcasts = await postsModel.where({id: ['IN', objects.ids], status}).order('id DESC').select();
    //   const metaModel = this.model('postmeta', {appId: this.appId})
    //   _formatMeta(podcasts)
    //
    //   for (const item of podcasts) {
    //     item.url = ''
    //     const userModel = this.model('users');
    //     如果有作者信息
    // if (!Object.is(item.meta._author_id, undefined)) {
    //   const authorInfo = await userModel.where({id: item.meta._author_id}).find()
    //   item.authorInfo = authorInfo
    //   查询 出对应的作者信息
    // } else {
    //   item.authorInfo = await userModel.where({id: item.author}).find()
    // }
    // _formatOneMeta(item.authorInfo)
    // if (item.authorInfo.hasOwnProperty('meta')) {
    //   if (item.authorInfo.meta.hasOwnProperty('avatar')) {
    //     item.authorInfo.avatar = await this.model('postmeta').getAttachment('file', item.authorInfo.meta.avatar)
    //   }
    // }
    // 如果有封面 默认是 thumbnail 缩略图，如果是 podcast 就是封面特色图片 featured_image
    // if (!Object.is(item.meta._thumbnail_id, undefined)) {
    //   item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
    // }
    // }
    // return {
    // "count":21,"totalPages":3,"pagesize":10,"currentPage":1,
    // }
    // Reflect.deleteProperty(objects, 'ids')
    // return think.extend({}, objects, {data: podcasts})
    //   // return Object.assign({}, podcasts, objects)
    // }
    // Reflect.deleteProperty(objects, 'ids')
    // return think.extend({}, objects, {data: []})
  }

  async getObjectsInTermsByLimit (terms) {
    const taxonomyModel = this.model('taxonomy', {appId: this.appId})
    const objects = await taxonomyModel.getObjectsInTermsByLimit(terms)
    if (!think.isEmpty(objects)) {
      const postsModel = this.model('posts', {appId: this.appId})
      const podcasts = await postsModel.where({id: ['IN', objects]}).select();
      const metaModel = this.model('postmeta', {appId: this.appId})
      _formatMeta(podcasts)

      for (const item of podcasts) {
        item.url = ''
        const userModel = this.model('users');
        // 如果有作者信息
        if (!Object.is(item.meta._author_id, undefined)) {
          const authorInfo = await userModel.where({id: item.meta._author_id}).find()
          item.authorInfo = authorInfo
          // 查询 出对应的作者信息
        } else {
          item.authorInfo = await userModel.where({id: item.author}).find()
        }

        // 如果有封面 默认是 thumbnail 缩略图，如果是 podcast 就是封面特色图片 featured_image
        if (!Object.is(item.meta._thumbnail_id, undefined)) {
          item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
        }
      }

      return podcasts
    }
    return []
  }

  async getAllFromPage () {
    let query = {}
    const title = this.get('title')
    const author = this.get('author')
    if (!think.isEmpty(author)) {
      query.author = author
    }
    // date query
    const status = this.get('status')
    if (think.isEmpty(status) || status === 'all') {
      query.status = ['NOT IN', 'trash']
    } else {
      query.status = status
    }
    // query.parent = 0
    query.parent = !think.isEmpty(this.get('parent')) ? this.get('parent') : 0
    // query.parent = this.get('parent')
    // query.type = 'post_format'
    query.type = !think.isEmpty(this.get('type')) ? this.get('type') : 'post_format'
    // query.sticky = fals
    // query.sticky = this.get('sticky')
    let list = []
    const category = this.get('category')
    // if (!think.isEmpty(category)) {
    //
    // }
    if (!think.isEmpty(category)) {
      // list = await this.model('posts', {appId: this.appId}).findByCategory(category, this.get('page'), this.get('pagesize') ? this.get('pagesize') : 100)
      list = await this.model('posts', {appId: this.appId}).findByCategory(category, this.get('page'), 12)
      // return list
    } else if (this.get('sticky') === 'true') {
      const stickys = this.options.stickys
      list = await this.model('posts', {appId: this.appId}).getStickys(stickys)

    } else {
      // list = await this.model('posts').select()
      list = await this.model('posts')
      // .where(query)
        .field(fields.join(","))
        .order('modified ASC')
        .page(this.get('page'), this.get('pagesize') ? this.get('pagesize') : 30)
        .countSelect()
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
        // think._.reverse(item.items)
      }
      Reflect.deleteProperty(item.meta, '_items')

      item.url = ''
      // 如果有音频
      if (!Object.is(item.meta._audio_id, undefined)) {
        // 音频播放地址
        item.url = await metaModel.getAttachment('file', item.meta._audio_id)
      }

      const userModel = this.model('users');
      // TODO: 如果有多作者信息
      // if (!Object.is(item.meta._author_id, undefined)) {
      // const authorInfo = await userModel.where({id: item.meta._author_id}).find()
      // const authorInfo = await userModel.getById(item.meta_author_id)
      // userInfo.avatar = await this.model('postmeta').getAttachment('file', userInfo.meta.avatar)
      // item.author = authorInfo
      // 查询 出对应的作者信息
      // } else {
      //   item.author = await userModel.getById(item.author)
      // }
      // 单作者
      item.author = await userModel.getById(item.author)

      // await this.dealLikes(item)
      const userId = this.ctx.state.user.id
      item.like_count = await metaModel.getLikedCount(item.id)

      // 获取当前用户是否喜欢
      const iLike = await metaModel.getLikeStatus(userId, item.id)
      item.i_like = iLike.contain > 0
      item.likes_enabled = true
      item.sharing_enabled = true

      _formatOneMeta(item.author)
      if (item.author.hasOwnProperty('meta')) {
        if (item.author.meta.hasOwnProperty('avatar')) {
          item.author.avatar = await this.model('postmeta').getAttachment('file', item.author.meta.avatar)
        }
      }
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
      }
    }
    return list
  }

  async newAction () {
    const data = this.post()
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
    if (think._.has(data, 'sticky')) {
      if (data.sticky === true) {
        await this.model('options', {appId: this.appId}).addSticky(this.id.toString())
      }
      if (data.sticky === false) {
        await this.model('options', {appId: this.appId}).removeSticky(this.id.toString())
      }
    }
    if (!think.isEmpty(data.block)) {
      data.block = JSON.stringify(data.block)
    }

    const postId = await this.modelInstance.setRelation(false).add(data)


    // 2 更新 meta 数据
    if (!Object.is(data.meta, undefined)) {
      const metaModel = this.model('postmeta', {appId: this.appId})
      // 保存 meta 信息
      await metaModel.save(postId, data.meta)
    }
    // 3 添加内容与 term 分类之间的关联
    // term_taxonomy_id
    const defaultTerm = this.options.default.term
    await this.model('taxonomy').relationships(postId, defaultTerm)

    // 已用 block 替代
    /*
     // 5 如果有关联信息，更新关联对象信息
     if (!Object.is(data.relateTo, undefined) && !think.isEmpty(data.relateTo)) {
       const metaModel = this.model('postmeta')
       // 保存关联对象的 meta 信息
       await metaModel.related(data.relateTo, postId, data.relateStatus)
     }
 */
    // 6 添加 Love(like) 信息
    await this.newLike(postId)

    const newPost = await this.getPost(postId)

    // 下发回忆通知
    // 0bEMgmkRis7a09BsGreIgj-paRSca9fN-pvMz5WpmH8
    // 项目名称
    // {{keyword1.DATA}}
    // 回复者
    // {{keyword2.DATA}}
    // 留言内容
    // {{keyword3.DATA}}
    /*    await this.wechatService.API
          .sendMiniProgramTemplate(
            'oTUP60A_0LCR7hYH0EQ7kEaakLCg',
            'Q6oT1lITd1kp3swZnJh3dRDftvtiJrEmOWeaN6AlTqM',
            `/page/love?id=${data.parent}`,
            data.formId,
            {
              keyword1: {
                value: `你最爱的：${data.title.split('-')[0]} 有新的回忆`,
                color: '#175177'
              },
              keyword2: {
                value: data.content
              },
              keyword3: {
                value: '点击进入小程序查看'
              }
            })*/
    // 下发主题通知
    // 0bEMgmkRis7a09BsGreIgj-paRSca9fN-pvMz5WpmH8
    // oTUP60A_0LCR7hYH0EQ7kEaakLCg
    return this.success(newPost)
  }

  async newLike (postId) {
    const userId = this.ctx.state.user.id
    const id = postId
    let date = this.post('love_date')
    // 日期是要检查 的
    if (!think.isEmpty(date)) {
      const isDate = think._.isDate(new Date(date));
      if (!isDate) {
        return this.fail('日期格式错误')
      }
      // 验证日期的正确性
      // const d = getMonthFormatted(new Date(date).getMonth())
      // if (d === 'NaN') {
      //   return this.fail('日期格式错误')
      // }
    } else {
      date = new Date()
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
    await this.model('users').newLike(userId, this.appId, id)
  }
  /**
   * 获取内容
   * @param post_id
   * @returns {Promise<*>}
   */
  async getPost (post_id) {
    // 获取精选内容列表
    const stickys = this.options.stickys
    const postModel = this.model('posts', {appId: this.appId})
    const metaModel = this.model('postmeta', {appId: this.appId})
    const userModel = this.model('users');

    let data = await postModel.getById(post_id)
    const isSticky = think._.find(stickys, (id) => {
      return post_id.toString() === id
    })

    if (isSticky) {
      data.sticky = true
    } else {
      data.sticky = false
    }
    _formatOneMeta(data)
    data.url = ''
    // 处理音频
    // if (!Object.is(data.meta._audio_id, undefined)) {
    //   data.url = await metaModel.getAttachment('file', item.meta._audio_id)
    // }
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
    // if (!Object.is(data.meta._assets, undefined)) {
    //   data.assets = data.meta._assets
    // }

    // 如果有封面 默认是 thumbnail 缩略图，如果是 podcast 就是封面特色图片 featured_image
    // if (!Object.is(item.meta['_featured_image']))
    if (!Object.is(data.meta._thumbnail_id, undefined)) {
      data.featured_image = await metaModel.getAttachment('file', data.meta._thumbnail_id)
    }

    if(think.isEmpty(data.block)) {
      data.block = []
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
    post.categories = think._.map(post.categories, 'term_id')
    const postFormat = await _taxonomy.getFormat(post.id)
    if (!think.isEmpty(postFormat)) {
      post.type = postFormat.slug
    }
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

}
