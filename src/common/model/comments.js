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
      // metas: {
      //   type: think.Model.HAS_MANY,
      //   model: 'postmeta',
      //   fKey: 'post_id',
      //   field: "post_id,meta_key,meta_value"
        // rModel: 'usermeta',
        // fKey: 'users_id'
      // }
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
    return this.alias('p').join({
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
  }

  // async update (data) {
  // return await super.update(data, this.options)
  // if (!Object.is(data['featured_image'], undefined)) {
  //   console.log(JSON.stringify(data))
  //
  // }
  // }
  // async save(data) {
  // let res = await this.add{{
  // }}
  // }
}
