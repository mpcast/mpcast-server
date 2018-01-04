/* eslint-disable prefer-promise-reject-errors,no-console */
// const {PasswordHash} = require('phpass');
const Base = require('./base');

module.exports = class extends Base {
  get pk() {
    return 'object_id';
  }
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
}
