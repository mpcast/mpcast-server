/* eslint-disable prefer-promise-reject-errors,no-console,no-case-declarations,default-case,no-undef */
// const {PasswordHash} = require('phpass');
const Base = require('./base');

module.exports = class extends Base {
  // constructor(...args) {
  //   super(...args);
  //   this.appId = ''
  //   if (this.config['appId'] !== undefined) {
  //     this.appId = this.config['appId'] + '_'
  //   }
  // }
  //
  // get tablePrefix() {
  //   return 'picker_'+ this.appId;
  // }
  async getAttachment (type, post_id) {
    let query = {}
    query.post_id = post_id
    if (!think.isEmpty(query.post_id)) {
      switch (type) {
        case 'file': {
          query = think.extend({'meta_key': '_attachment_file'}, query)
          const attachment = await this.where(query).find()
          if (!think.isEmpty(attachment)) {
            return JSON.parse(attachment.meta_value)
          }
          return ''
        }
        case 'meta':
          break
      }
    }

  }

  async save (post_id, meta) {
    for (const key of Object.keys(meta)) {
      await this.thenUpdate({
        'post_id': post_id,
        'meta_key': key,
        'meta_value': meta[key] + ''
      }, {post_id: post_id, meta_key: key})
    }
  }

  // async addMeta (user_id, post_id) {
  //   await this.add({
  //     post_id: id,
  //     meta_key: '_liked',
  //     meta_value: ['exp', `JSON_ARRAY(JSON_OBJECT('id', ${userId}))`]
  //   })
  // }
  async getMeta (post_id, key) {
    const data = await this.where({post_id: post_id, meta_key: key}).find()
    return data
  }

  // async getThumbnail(post_id) {
  //   let query = {}
  //   query.post_id = post_id
  //   query = think.extend({'meta_key': '_thumbnail_id'}, query)
  //   let thumbnail = await this.where(query).find()
  //   return JSON.parse(attachment['meta_value'])
  // }

  /**
   * 统计内容喜欢的人数
   *
   * @param post_id
   * @returns {Promise.<number|*>}
   */
  async getLikedCount (post_id) {
    const total = await this.field('JSON_LENGTH(meta_value) as like_count').where({
      post_id: post_id,
      meta_key: '_liked'
    }).find()
    return total.like_count
  }

  /**
   * 添加新喜欢的人员
   * @param user_id
   * @param post_id
   * @returns {Promise.<void>}
   */
  async newLike (user_id, post_id, ip) {
    await this.where({
      post_id: post_id,
      meta_key: '_liked'
    }).update({
      'post_id': post_id,
      'meta_key': '_liked',
      'meta_value': ['exp', `JSON_ARRAY_APPEND(meta_value, '$', JSON_OBJECT('id', '${user_id}','ip', '${_ip2int(ip)}'))`]
    })
  }

  /**
   * UnLike post
   * @param user_id
   * @param post_id
   * @returns {Promise<number>}
   */
  async unLike (user_id, post_id) {
     const res = await this.where(`post_id = '${post_id}' AND meta_key = '_liked' AND JSON_SEARCH(meta_value, 'one', ${user_id}) IS NOT NULL`).update({
        'meta_value': ['exp', `JSON_REMOVE(meta_value, SUBSTRING_INDEX(REPLACE(JSON_SEARCH(meta_value, 'one', '${user_id}', NULL, '$**.id'), '"', ''), '.', 1))`]
      }
    )
    return res
  }

  /**
   * 获取用户是否 like a post
   * @param user_id
   * @param post_id
   * @returns {Promise<any>}
   */
  async getLikeStatus (user_id, post_id) {
    const data = await this.field(`JSON_LENGTH(meta_value) AS like_count, JSON_CONTAINS(meta_value, '[{"id": "${user_id}"}]') AS contain`).where(`meta_key = '_liked' and post_id = ${post_id}`).find()
    return data
  }
}
