/* eslint-disable no-undef */
const BaseRest = require('../Base');
module.exports = class extends BaseRest {
  /**
   * 获取我喜欢的全部内容
   *
   * @returns {Promise.<*>}
   */
  async indexAction () {
    const userMeta = this.model('usermeta')
    const userId = this.ctx.state.user.id
    const data = await userMeta.where(`meta_key = 'picker_${this.appId}_liked_posts' and user_id = ${userId}`).find()
    if (!think.isEmpty((data))) {
      data.meta_value = JSON.parse(data.meta_value)
      return this.success({found: data.meta_value.length, likes: data.meta_value})
    } else {
      return this.success({found: 0})
    }
  }
}
