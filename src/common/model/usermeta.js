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

  async save (user_id, meta) {
    try {
      for (const key of Object.keys(meta)) {
        await this.thenUpdate({
          'user_id': user_id,
          'meta_key': key,
          'meta_value': meta[key] + ''
        }, {user_id: user_id, meta_key: key})
      }
    } catch (e) {
      return false
    }
    return true
  }
}
