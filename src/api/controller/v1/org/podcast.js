/* eslint-disable default-case,no-undef,no-return-await */
const BaseRest = require('./_rest')
module.exports = class extends BaseRest {
  /**
   * 获取分类信息
   * /api/category 获取全部栏目（树结构）
   * /api/category/1 获取栏目id为1的栏目信息
   * @returns {Promise.<*>}
   */
  async getAction () {
    // console.log('lalalala')
    // console.log(this.ctx.state.user)
    const id = this.get('id')
    // console.log('lala')
    console.log(id + '---')
    const type = 'podcast'
    let query = {}
    query.status = ['NOT IN', 'trash']
    // query.type = "";
    let fields = [];
    fields.push('id');
    fields.push('author');
    fields.push('status');
    fields.push('type');
    fields.push('title');
    fields.push('name');
    // fields.push('content');
    fields.push('sort');
    fields.push('excerpt');
    fields.push('date');
    fields.push('modified');
    fields.push('parent');
    fields = unique(fields);

    if (!think.isEmpty(id)) {
      query.id = id
    }

    if (!think.isEmpty(type)) {
      query.type = type;
      switch (query.type) {
        case 'podcast':
          fields.push('content')
          if (!think.isEmpty(id)) {
            console.log('id not empty' + id)
            // query = {status: ['!=', 'delete'], id: id, parent: id, _logic: 'OR'}
            query = {status: ['!=', 'delete'], _complex: {id: id, parent: id, _logic: 'OR'}}
            return await this.getPodcast(query, fields)
          } else {
            query = {status: ['!=', 'delete'], type: type}
            return await this.getPodcastList(query, fields)
          }
          break;
        case "article":
          break;
        case "resume":
          fields.push('content_json')
          // fields.push('content')
          break;
        case "snippets":
          break;
        case "pages":
          break;
      }
    }
    // 条件查询
    // let list = await this.modelInstance.where(query).field(fields.join(",")).order('modified DESC').page(this.get('page'), 10).countSelect()
    // console.log(JSON.stringify(list))
    // 处理分类
    // let _taxonomy = this.model('taxonomy', {orgId: this.orgId})
    // for (let item of list.data) {
    //   item.terms = await _taxonomy.getTermsByObject(item.id)
    // }
    // 处理内容层级
    // let treeList = await arr_to_tree(list.data, 0);
    // list.data = treeList;
    //
    // return this.success(list)
  }

  async getPodcastList (query, fields) {
    const list = await this.modelInstance.where(query).field(fields.join(",")).order('sort ASC').page(this.get('page'), 100).countSelect()

    // 处理播放列表音频 Meta 信息
// eslint-disable-next-line no-undef
    _formatMeta(list.data)
    // 根据 Meta 信息中的音频附件 id 查询出音频地址
    const metaModel = this.model('postmeta', {orgId: this.orgId})
    for (const item of list.data) {
      item.url = ''
      // 如果有音频
      if (!Object.is(item.meta._audio_id, undefined)) {
        // 音频播放地址
        item.url = await metaModel.getAttachment('file', item.meta._audio_id)
      }
      // 如果有作者信息
      if (!Object.is(item.meta._author_id, undefined)) {
        // item.author =
        // 查询 出对应的作者信息
      }
      const user = this.ctx.state.user
      item.author = user
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
    }
    // 处理分类及内容层级
    await this.dealTerms(list)
    // 返回一条数据
    return this.success(list.data)
  }
  /**
   * 获取播客类型的内容
   *
   * @returns {Promise.<void>}
   */
  async getPodcast (query, fields) {
    const list = await this.modelInstance.where(query).field(fields.join(",")).order('sort ASC').page(this.get('page'), 100).countSelect()

    // 处理播放列表音频 Meta 信息
    _formatMeta(list.data)

    // 根据 Meta 信息中的音频附件 id 查询出音频地址
    const metaModel = this.model('postmeta', {orgId: this.orgId})
    for (const item of list.data) {
      item.url = ''
      // 如果有音频
      if (!Object.is(item.meta._audio_id, undefined)) {
        // 音频播放地址
        item.url = await metaModel.getAttachment('file', item.meta._audio_id)
      }
      // 如果有作者信息
      if (!Object.is(item.meta._author_id, undefined)) {
        // item.author =
        // 查询 出对应的作者信息
      }
      const user = this.ctx.state.user
      item.author = user
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
    }
    // 处理分类及内容层级
    await this.dealTerms(list)
    // 返回一条数据
    return this.success(list.data[0])
  }

  /**
   * 处理分类信息，为查询的结果添加分类信息
   * @param list
   * @returns {Promise.<*>}
   */
  async dealTerms (list) {
    const _taxonomy = this.model('taxonomy', {orgId: this.orgId})
    for (const item of list.data) {
      item.terms = await _taxonomy.getTermsByObject(item.id)
    }
    // 处理内容层级
    // let treeList = await arr_to_tree(list.data, 0);
    list.data = await arr_to_tree(list.data, 0);
    

    return list
  }

  async postAction () {
    // console.log(this.ctx.state.user)
    // let type = this.get('type')
    const data = this.post()
    if (think.isEmpty(data.type)) {
      data.type = 'podcast'
    }
    const currentTime = new Date().getTime();
    data.date = currentTime
    data.modified = currentTime
    data.author = this.ctx.state.user.id
    if (think.isEmpty(data.status)) {
      data.status = 'auto-draft';
    }
    const res = await this.modelInstance.add(data)

    return this.success(res)
  }

  /**
   * update resource
   * @return {Promise} []
   */
  async putAction () {
    if (!this.id) {
      return this.fail('params error');
    }
    const pk = this.modelInstance.pk;
    // const pk = await this.modelInstance.getPk();
    const data = this.post();
    delete data[pk];
    if (think.isEmpty(data)) {
      return this.fail('data is empty');
    }
    // 更新
    const currentTime = new Date().getTime();
    data.modified = currentTime

    await this.modelInstance.where({[pk]: this.id}).update(data);
    // }
    // 更新 meta 图片数据
    if (!Object.is(data.meta, undefined)) {
      const metaModel = await this.model('postmeta', {orgId: this.orgId})
      // 保存 meta 信息
      await metaModel.save(this.id, data.meta)
    }
    // return this.success({affectedRows: rows});
    // 返回的状态
    return this.success()
  }

}
