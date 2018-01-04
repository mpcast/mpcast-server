const BaseRest = require('./_rest.js');
module.exports = class extends BaseRest {
  async getAction() {
    const appsModel = this.model('apps')
    const app = await appsModel.get(this.appId)
    return this.success(app)
  }
};
