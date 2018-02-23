/* eslint-disable no-undef */
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
  async getStickys (stickys, page = 1, pagesize) {
    const list = await this.where({
      id: ['IN', stickys]
      // 按 IN 条件的顺序查询出结果
    }).order(`INSTR (',${stickys},', CONCAT(',',id,','))`).page(page, pagesize).countSelect()
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
   * 获取最新的内容
   * @param category
   * @param page
   * @param pagesize
   * @param status
   * @returns {Promise<Object>}
   */
  async getNews (page = 1, pagesize, status) {
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
    }).field(fileds).where(`(tt.taxonomy = 'category') AND p.status = '${status}'`)
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
   * 获取最热的内容
   * @param page
   * @param pagesize
   * @returns {Promise<Object>}
   */
  async getPopular (page = 1, pagesize) {
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
    const data = await this.alias('p').field('id, name, title, content, author, modified, parent, status, JSON_LENGTH(meta_value) as view_count').join({
      postmeta: {
        join: 'inner',
        as: 'pm',
        on: ['pm.post_id', 'p.id']
      }
    }).where(`meta_key = '_post_views'`)
      .page(page, pagesize)
      .setRelation(true).countSelect()

    return data
    // const data = await this.field(`JSON_LENGTH(meta_value) AS views_count`).where(`meta_key = '_thumbs' and post_id = ${post_id}`).find()
    // if (!think.isEmpty(data)) {
    //   if (!Object.is(data.contain, undefined)) {
        // return true
        // return data
      // }
    // }
    // return {'thumbs_count': 0, 'contain': 0}
  }

  /**
   * 按分类 name 或 slug 查询内容
   * @param category
   * @param page
   * @param pagesize
   * @param status
   * @returns {Promise<Object>}
   */
  async findByCategory (category, page = 1, pagesize, rand, status = 'publish') {
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
    const orderBy = rand === true ? 'rand()' : 'modified DESC'
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
    }).field(fileds).where(`(t.slug = '${category}' OR t.name LIKE '%${category}%') AND p.status = '${status}'`)
      .order(orderBy)
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

    // const _taxonomy = this.model('taxonomy', {appId: this.appId})
    // for (const item of list.data) {
    //   item.categories = await _taxonomy.findCategoriesByObject(item.id)
    // }
    // 处理内容层级
    // let treeList = await arr_to_tree(list.data, 0);
    // list.data = await arr_to_tree(list.data, 0);

    // return list

    return data
  }

  /**
   * 按类别统计用户发布的内容数量
   * @param category
   * @param author
   * @param status
   * @returns {Promise<void>}
   */
  async countByAuthorPost(category, author, status = 'trash') {
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
    }).where(`t.id = '${category}' AND author = '${author}'  AND p.status NOT IN ('${status}')`)
      .count()

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
  async getNavItems(ids) {
    // let ret = await think.cache("_nav_items", async() => {
    let _fields = [];
    _fields.push('id');
    // _fields.push('author');
    _fields.push('status');
    // _fields.push('type');
    _fields.push('title');
    _fields.push('name');
    // _fields.push('content');
    // fields.push('excerpt');
    // _fields.push('date');
    // _fields.push('modified');
    // _fields.push('parent');
    let query = {
      id: ["IN", ids],
      status: ["NOT IN", 'trash']
    }
    let items = await this.where(query).field(_fields.join(",")).select();
    return _formatMeta(items)
    // let nav_items = [];
    //
    // for (let item of items) {
    //
    //   item.meta = {};
    //   if (item.metas.length > 0) {
    //     for (let meta of item.metas) {
    //       // console.log(meta.meta_key + ":" + meta.meta_value);
    //       item.meta[meta.meta_key] = meta.meta_value;
    //     }
    //   }
    //   // Relation. item.metas;
    //   Reflect.deleteProperty(item, 'metas')
    //
    //   nav_items.push(item);
    // }

    // console.log(JSON.stringify(nav_items) + "___333")
    return nav_items;

    // }, this.cacheOptions);

    // return ret;
  }
}
