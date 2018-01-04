/* eslint-disable prefer-promise-reject-errors,no-console */
// const {PasswordHash} = require('phpass');
const Base = require('./base');

module.exports = class extends Base {
  // constructor(...args) {
  //   super(...args);
  //   this.orgId = ''
  //   if (this.config['orgId'] !== undefined) {
  //     this.orgId = this.config['orgId'] + '_'
  //   }
  // }
  //
  // get tablePrefix() {
  //   return 'picker_'+ this.orgId;
  // }
  async save (term_id, meta) {
    for (const key of Object.keys(meta)) {
      await this.thenUpdate({
        'term_id': term_id,
        'meta_key': key,
        'meta_value': meta[key] + ''
      }, {term_id: term_id, meta_key: key})
    }
  }
}
