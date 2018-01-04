const Base = require('./base.js');
const path = require('path');

module.exports = class extends Base {
  view (action = this.ctx.action) {
    const c = this.ctx.controller.split('/');
    const view = path.join(think.ROOT_PATH, 'src', this.ctx.module, 'view', this.ctx.controller)
    return this.display(`${view}_${this.ctx.action}`)
  }
  indexAction() {
    let data = {
      module: this.ctx.module,
      controller: this.ctx.controller
    }
    return this.view()
  }
};
