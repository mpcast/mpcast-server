const Base = require('./base');

/**
 * model
 */
module.exports = class extends Base {
  // constructor(...args) {
  //   super(...args);
  //   this.relation = {
  //     metas: {
  //       type: think.model.HAS_MANY,
  //       model: 'postmeta',
  //       fKey: 'post_id',
  //       field: "post_id,meta_key,meta_value",
  //     }
  //     // comment: think.Model.HAS_MANY,
  //     // cate: think.Model.MANY_TO_MANY
  //   };
  // }

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
    let _metaModel = this.model('postmeta', {appId: this.appId})
    let _id = await _metaModel.add({
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
   * 获取推荐内容
   * @param stickys
   * @returns {Promise.<*>}
   */
  async getItems (metaItems) {
    const list = await this.where({
      id: ['IN', metaItems]
      // 按 IN 条件的顺序查询出结果
    }).order(`INSTR (',${metaItems},', CONCAT(',',id,','))`)
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
    }).field('p.id, p.author, p.title, p.status, p.content, p.modified, p.parent').where(`tr.term_id IN(${termIds}) AND tr.taxonomy = 'category' AND ${query}`).order('p.id DESC').page(page, pagesize).countSelect()


    return data
  }

  /**
   * 按分类 name 或 slug 查询内容
   * @param category
   * @returns {Promise<any>}
   */
  async findByCategory(category, page = 1, pagesize) {
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
        // on: {['tr.term_taxonomy_id', 'tt.term_taxonomy_id']}
      },
      posts: {
        join: 'inner',
        as: 'p',
        on: ['p.id', 'tr.object_id']
      }
    }).field(fileds).where(`t.slug = '${category}' OR t.name LIKE '%${category}%'`).order('sort ASC, modified ASC').page(page, pagesize).setRelation(true).countSelect()
    let postIds = []
    data.data.forEach((item) => {
      postIds.push(item.id)
    })

    if (!think.isEmpty(postIds)) {
      // 处理 Meta 信息
      const metaModel = this.model('postmeta')
      let metaData = await metaModel.field('post_id, meta_key, meta_value').where({
        post_id: ['IN', postIds]
      }).select()

      data.data.forEach((item, i) => {
        item.metas = think._.filter(metaData, {post_id: item.id})
      })
    }
    return data
  }
}
