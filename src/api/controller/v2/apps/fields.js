/* eslint-disable no-undef,no-return-await,default-case,max-depth,no-warning-comments,comma-spacing */
const BaseRest = require('./Base')

let fields = [
  'id',
  'groupId',
  'name',
  'handle',
  'context',
  'instructions',
  'translatable',
  'type',
  'settings',
  'dateCreated',
  'dateUpdated',
  'uid'
]
module.exports = class extends BaseRest {
  async indexAction () {
    let query = this.get()
    // if (think._.has(query, 'appId')) {
    //   query = think._.omit(['appId'])
    // }
    // let object = { appId: 1, 'b': '2', 'c': 3 };

    query = think._.omit(query, ['appId']);
    // console.log(query)
    const list = await this.model('fields', {appId: this.appId})
      .where(query)
      .field(fields.join(","))
      .order('dateUpdated ASC')
      .page(this.get('page'), this.get('pagesize') ? this.get('pagesize') : 30)
      .countSelect()
    return this.success(list)
  }

  /**
   * 新建字段
   * @returns {Promise<*|boolean>}
   */
  async newAction () {
    const data = this.post()
  }
}

