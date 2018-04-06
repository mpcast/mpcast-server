/* eslint-disable no-undef */
const Base = require('./base');

/**
 * model
 */
module.exports = class extends Base {
  // constructor(...args) {
  //   super(...args)
  //   this.relation = {
  //     posts: {
  //       type: think.model.HAS_MANY,
  //       relation: false
  //     }
  //   }
  // }
  get relation () {
    return {
      metas: {
        type: think.Model.HAS_MANY,
        model: 'commentmeta',
        fKey: 'comment_id',
        field: "comment_id,meta_key,meta_value"
      },
      post: {
        model: 'posts',
        type: think.Model.BELONG_TO,
        key: 'post_id',
        field: 'id, title, name, type'
      },
      author: {
        model: 'users',
        type: think.Model.BELONG_TO,
        key: 'user_id',
        field: 'id, user_nicename AS name, user_email AS mail'
      }
    }
  }

  async getList (page = 1, pageSize = 10) {
    let fields = [
      'id',
      'comment_post_id as post_id',
      // 'comment_author as author',
      'comment_author_ip as ip',
      'comment_date as date',
      'comment_content as content',
      'comment_parent as parent',
      'user_id'
    ]
    let data = await this.field(fields).page(page, pageSize).countSelect()
    // let userIds = []
    for (let item of data.data) {
      item.author = Object.assign({}, item.author, {meta: {}})
      // item.author.meta = {}
      _formatOneMeta(item.author)
      // userIds.push(item.author)
      if (think._.has(item.author, 'meta')) {
        if (!Object.is(item.author.meta[`picker_${this.prefix}_wechat`], undefined)) {
          item.author.avatar = item.author.meta[`picker_${this.prefix}_wechat`].avatarUrl
        } else {
          item.author.avatar = await this.model('postmeta').getAttachment('file', item.author.meta.avatar)
        }
        Reflect.deleteProperty(item.author, 'meta')
      }
    }
    return data
  }
}
