const Base = require('./base');

/**
 * model
 */
module.exports = class extends Base {
  get relation () {
    return {
      // children: {
      //   type:think.Model.HAS_MANY,
      //   model: 'posts',
      //   fKey: 'parent'
      // },
      metas: {
        type: think.Model.HAS_MANY,
        model: 'postmeta',
        fKey: 'post_id',
        field: "post_id,meta_key,meta_value"
        // rModel: 'usermeta',
        // fKey: 'users_id'
      }
    };
  }

  /**
   * 添加 meta 信息
   *
   * @param post_id
   * @param meta_key
   * @param meta_value
   * @param unique
   * @returns {Promise.<*>}
   */
  async addMeta (post_id, meta_key, meta_value, unique = false) {
    const _metaModel = this.model('postmeta', {appId: this.appId})
    const _id = await _metaModel.add({
      post_id: post_id,
      meta_key: meta_key,
      meta_value: JSON.stringify(meta_value)
    })
    return _id
  }

  /**
   * 获取推荐内容
   * @param stickys
   * @returns {Promise.<*>}
   */
  async getStickys (stickys, page = 1) {
    const list = await this.where({
      id: ['IN', stickys]
      // 按 IN 条件的顺序查询出结果
    }).order(`INSTR (',${stickys},', CONCAT(',',id,','))`).page(page, 20).countSelect()
    return list
  }

  /**
   * 按标题查找相似的内容
   * 只查询 最爱 (loves) 分类下的，暂定。
   * @param title
   * @param page
   * @returns {Promise<Object>}
   */
  async findByTitle (title, page = 1, pagesize = 6) {
    // const list = await this.where({
    //   'title': ['like', `%${title}%`],
    //   'type': 'post_format'
    // }).page(page, pagesize).countSelect()
    // return list

    const fileds = [
      'p.id',
      'p.name',
      'p.title',
      'p.content',
      'p.author',
      'p.modified'
    ]
    const data = await this.model('terms', {appId: this.appId}).alias('t').join({
      term_taxonomy: {
        join: 'inner',
        as: 'tt',
        on: ['t.id', 'tt.term_id']
      },
      term_relationships: {
        join: 'inner',
        as: 'tr',
        on: ['tr.term_taxonomy_id', 'tt.id'],
      },
      posts: {
        join: 'inner',
        as: 'p',
        on: ['p.id', 'tr.object_id']
      }
    }).field(fileds).where(`t.slug = 'loves' AND p.title LIKE '%${title}%'`)
      .page(page, pagesize)
      .setRelation(true).countSelect()
    const postIds = []
    data.data.forEach((item) => {
      postIds.push(item.id)
    })

    if (!think.isEmpty(postIds)) {
      // 处理 Meta 信息
      const metaModel = this.model('postmeta')
      const metaData = await metaModel.field('post_id, meta_key, meta_value').where({
        post_id: ['IN', postIds]
      }).select()

      data.data.forEach((item, i) => {
        item.metas = think._.filter(metaData, {post_id: item.id})
      })
    }
    return data
  }

  /**
   * 按名称查找唯一值
   * @param name
   * @returns {Promise<any>}
   */
  async findByName (name) {
    const res = await this.where({
      name: name
    }).find()

    return res
  }

  /**
   * 按 id 批量查找内容
   * @param stickys
   * @returns {Promise.<*>}
   */
  async getItems (items) {
    const list = await this.where({
      id: ['IN', items]
      // 按 IN 条件的顺序查询出结果
    }).order(`INSTR (',${items},', CONCAT(',',id,','))`).select()
    return list
  }

  /**
   * 根据分类与内容状态获取 内容列表
   * @param termIds
   * @param status
   * @param page
   * @param pagesize
   * @returns {Promise<Object>}
   */
  async getList (termIds, page = 1, status, pagesize = 50) {
    let query = ''
    if (think.isEmpty(status)) {
      query = `p.status not in ('trash')`
    } else {
      query = `p.status = '${status}'`
    }

    // SELECT p.id, p.title, p.content FROM picker_S11SeYT2W_posts as p LEFT JOIN picker_S11SeYT2W_term_relationships AS tt ON p.id=tt.object_id
    // LEFT JOIN picker_S11SeYT2W_term_taxonomy as tr on tt.term_taxonomy_id = tr.term_id where tr.term_id IN(1, 3, 4) and tr.taxonomy = 'category' and p.status = 'publish' order by id desc;
    // SELECT * FROM think_user AS a LEFT JOIN `think_cate` AS c ON a.`id`=c.`id` LEFT JOIN `think_group_tag` AS d ON a.`id`=d.`group_id`
    const data = await this.alias('p').join({
      term_relationships: {
        join: 'left', // 有 left,right,inner 3 个值
        as: 'tt',
        on: ['p.id', 'tt.object_id']
      },
      term_taxonomy: {
        join: 'left',
        as: 'tr',
        on: ['tr.term_id', 'tt.term_taxonomy_id']
      }
    }).field('p.id, p.author, p.title, p.status, p.content, p.modified, p.parent')
      .where(`tr.term_id IN(${termIds}) AND tr.taxonomy = 'category' AND ${query}`)
      .order('p.id DESC')
      .page(page, pagesize)
      .countSelect()

    return data
  }

  /**
   * 按分类 name 或 slug 查询内容
   * @param category
   * @param page
   * @param pagesize
   * @param status
   * @returns {Promise<Object>}
   */
  async findByCategory (category, page = 1, pagesize, status = 'trash') {
    const fileds = [
      'p.id',
      'p.name',
      'p.title',
      'p.content',
      'p.author',
      'p.modified',
      'p.parent',
      'p.status'
    ]
    const data = await this.model('terms', {appId: this.appId}).alias('t').join({
      term_taxonomy: {
        join: 'inner',
        as: 'tt',
        on: ['t.id', 'tt.term_id']
      },
      term_relationships: {
        join: 'inner',
        as: 'tr',
        on: ['tr.term_taxonomy_id', 'tt.id'],
      },
      posts: {
        join: 'inner',
        as: 'p',
        on: ['p.id', 'tr.object_id']
      }
    }).field(fileds).where(`(t.slug = '${category}' OR t.name LIKE '%${category}%') AND p.status NOT IN ('${status}')`)
      .order('modified DESC')
      .page(page, pagesize)
      .setRelation(true).countSelect()

    const postIds = []
    data.data.forEach((item) => {
      postIds.push(item.id)
    })

    if (!think.isEmpty(postIds)) {
      // 处理 Meta 信息
      const metaModel = this.model('postmeta')
      const metaData = await metaModel.field('post_id, meta_key, meta_value').where({
        post_id: ['IN', postIds]
      }).select()

      data.data.forEach((item, i) => {
        item.metas = think._.filter(metaData, {post_id: item.id})
      })
    }
    return data
  }


  /**
   * 查询分类下作者相关的内容
   *
   * @param category
   * @param author
   * @param page
   * @param pagesize
   * @returns {Promise<Object>}
   */
  async findByAuthorPost (category, author, page = 1, pagesize, status = 'trash') {
    const fileds = [
      'p.id',
      'p.name',
      'p.title',
      'p.content',
      'p.author',
      'p.parent',
      'p.modified',
      'p.status'
    ]
    const data = await this.model('terms', {appId: this.appId}).alias('t').join({
      term_taxonomy: {
        join: 'inner',
        as: 'tt',
        on: ['t.id', 'tt.term_id']
      },
      term_relationships: {
        join: 'inner',
        as: 'tr',
        on: ['tr.term_taxonomy_id', 'tt.id'],
      },
      posts: {
        join: 'inner',
        as: 'p',
        on: ['p.id', 'tr.object_id']
      }
    }).field(fileds)
      .where(`t.slug = '${category}' OR t.name LIKE '%${category}%' OR t.id = '${category}' AND author = '${author}'  AND p.status NOT IN ('${status}')`)
      .order('modified DESC')
      .page(page, pagesize).setRelation(true).countSelect()

    const postIds = []
    data.data.forEach((item) => {
      postIds.push(item.id)
    })

    if (!think.isEmpty(postIds)) {
      // 处理 Meta 信息
      const metaModel = this.model('postmeta')
      const metaData = await metaModel.field('post_id, meta_key, meta_value').where({
        post_id: ['IN', postIds]
      }).select()

      data.data.forEach((item, i) => {
        item.metas = think._.filter(metaData, {post_id: item.id})
      })
    }
    return data
  }

  async deletePost (id) {
  }

}
