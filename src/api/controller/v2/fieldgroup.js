/* eslint-disable no-undef,no-return-await,default-case,max-depth,no-warning-comments,comma-spacing */
const BaseRest = require('./_rest')
let fields = [
  'id',
  'name',
  'dateCreated',
  'dateUpdated',
  'uid'
]
module.exports = class extends BaseRest {
  async indexAction () {
    const list = await this.model('fieldgroup')
    // .where(query)
      .field(fields.join(","))
      .order('dateUpdated ASC')
      .page(this.get('page'), this.get('pagesize') ? this.get('pagesize') : 30)
      .countSelect()
    return this.success(list)
  }

}

