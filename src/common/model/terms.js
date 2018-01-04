/* eslint-disable prefer-promise-reject-errors,no-console */
// const {PasswordHash} = require('phpass');
const Base = require('./base');

module.exports = class extends Base {
// eslint-disable-next-line no-useless-constructor
  constructor(...args) {
    super(...args);
  }
  get relation() {
    return {
      metas: {
        type: think.Model.HAS_MANY,
        model: 'termmeta',
        fKey: 'term_id',
        field: "term_id,meta_key,meta_value"
      }
    }
  }

  async allTerms (flag) {
    const cacheKey = this.tablePrefix + 'terms';
    if (flag) {
      await think.cache(cacheKey, null)
    }
    const ret = await think.cache(cacheKey)

    if (think.isEmpty(ret)) {
      const data = await this.select()
      await think.cache(cacheKey, JSON.stringify(data))
    }
    const cacheData = await think.cache(cacheKey)
    return JSON.parse(cacheData)
  }

  async allTaxonomies(flag) {
    console.log(this.appId)
    const cacheKey = this.tablePrefix + 'taxonomies';

    if (flag) {
      await think.cache(cacheKey, null)
    }
    const ret = await think.cache(cacheKey)

    if (think.isEmpty(ret)) {
      const data = await this.model('taxonomies').select()
      await think.cache(cacheKey, JSON.stringify(data))
    }
    const cacheData = await think.cache(this.cacheKey)
    return JSON.parse(cacheData)
  }
}
