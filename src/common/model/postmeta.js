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
    if (!think.isEmpty(total)) {
      return total.like_count
    } else {
      return 0
    }
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
   * 删除关联的 item 项目
   * @param postId
   * @param itemId
   * @returns {Promise<number>}
   */
  async removeItem (postId, itemId) {
    const res = await this.where(`post_id = '${postId}' AND meta_key = '_items' AND JSON_SEARCH(meta_value, 'one', ${itemId}) IS NOT NULL`).update({
      'meta_value': ['exp', `JSON_REMOVE(meta_value, SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '${itemId}', NULL , '$**.id'), '"', ''), '.', 1))`]
    })
    const {items} = await this.field(`meta_value as items`).where(`post_id = '${postId}' AND meta_key = '_items'`).find()
    return JSON.parse(items)
  }

  /**
   * 关联 Item 对象
   * @param postId
   * @param itemId
   * @param status
   * @returns {Promise<void>}
   */
  async related (postId, itemId, status) {
    // 每次添加插入至顶部
    await this.where({
      post_id: postId,
      meta_key: '_items'
    }).update({
      'post_id': postId,
      'meta_key': '_items',
      'meta_value': ['exp', `JSON_ARRAY_INSERT(meta_value, '$[0]', JSON_OBJECT('id', '${itemId}','status', '${status}'))`]
    })
  }
  /**
   * 更新关联的 Item 状态
   * @param postId
   * @param itemId
   * @param status
   * @returns {Promise<number>}
   */
  async changeItemStatus (postId, itemId, status) {
    // CONCAT(SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '3', NULL , '$**.id')
    // 这个是为了处理 JSON 返回的值 $[0] 这样的，来处理对应的 json array 下的 json object Key value
    const res = await this.where(`post_id = '${postId}' AND meta_key = '_items' AND JSON_SEARCH(meta_value, 'one', ${itemId}) IS NOT NULL`).update({
      'meta_value': ['exp', `JSON_REPLACE(meta_value, CONCAT(SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '${itemId}', NULL , '$**.id'), '"', ''), '.', 1),'.status'), '${status}')`]
    })
    return res
  }

  /**
   * 获取用户是否 like a post
   * @param user_id
   * @param post_id
   * @returns {Promise.<{like_count: number, contain: number}>}
   */
  async getLikeStatus (user_id, post_id) {
    const data = await this.field(`JSON_LENGTH(meta_value) AS like_count, JSON_CONTAINS(meta_value, '[{"id": "${user_id}"}]') AS contain`).where(`meta_key = '_liked' and post_id = ${post_id}`).find()
    if (!think.isEmpty(data)) {
      if (!Object.is(data.contain, undefined)) {
        // console.log('-------------------')
        // console.log(JSON.stringify(data))
        // return true
        return data
      }
    }
    return {'like_count': 0, 'contain': 0}
    // console.log('-----------xxxxx')
    // if (!think.isEmpty(data)) {
    //   console.log(JSON.stringify(data))
    // } else {
    //   console.log('xxxxxxxxxxxx')
    // }
    // return !think.isEmpty(data);
  }
}
