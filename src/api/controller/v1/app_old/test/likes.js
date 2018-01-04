const BaseRest = require('../_rest.js');
module.exports = class extends BaseRest {
  async getAction() {

    const data = {
      "i_like": false,
      "like_count": 30,
      "site_ID": 2916284,
      "post_ID": 1,
      "meta": {
      }
    }

    return this.success(data)
    // const appsModel = this.model('apps')
    // const app = await appsModel.get(this.appId)
    // return this.success(app)
  }
};
