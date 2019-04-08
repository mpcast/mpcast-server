/* eslint-disable no-undef,no-return-await */
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

  async findByGroupId (groupId, page, pageSize) {
    // query = think._.omit(query, ['appId']);
    // console.log(query)
    // const list = await this.model('fields', {appId: this.appId})
    // const list = await this.where(query)
      // .field(fields.join(","))
      // .order('dateUpdated ASC')
      // .page(page, pageSize)
      // .countSelect()
    // return list
    // return this.success(list)
    return await this.where({gropId: groupId}).select()
  }
}
