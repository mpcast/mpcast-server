/* eslint-disable no-undef,no-return-await,default-case,max-depth,no-warning-comments,comma-spacing */
const BaseRest = require('./Base')
let fields = [
  'id',
  'name',
  'dateCreated',
  'dateUpdated',
  'uid'
]
module.exports = class extends BaseRest {
  async indexAction () {
    const list = await this.model('fieldgroups', {appId: this.appId})
    // .where(query)
      .field(fields.join(","))
      .order('dateUpdated ASC')
      .page(this.get('page'), this.get('pagesize') ? this.get('pagesize') : 30)
      .countSelect()
    return this.success(list)
  }

  /**
   * 新建字段群组
   * @returns {Promise<*>}
   */
  async newAction () {
    const data = this.post()
    if (think.isEmpty(data.name)) {
      return this.fail('组名不能为空')
    }

    const res = await this.model('fieldgroups').where({
      name: data.name
    }).thenAdd({
      name: data.name,
      date: new Date().getTime(),
      modified: new Date().getTime(),
      uid: think.uuid(4)
    })

    return this.success(res)
  }
}

