/* eslint-disable no-return-await,no-undef */
module.exports = class extends think.Model {
  get relation () {
    return {
      metas: {
        type: think.Model.HAS_MANY,
        model: 'orgmeta',
        fKey: 'org_id'
      },
      apps: {
        type: think.Model.HAS_MANY,
        model: 'apps',
        fKey: 'org_id'
      }
    };
  }

  async get () {
    const orgs = await this.list();
    return orgs
  }

  async list () {
    const map = {}
    const list = await this.where(map).field(['id', 'domain', 'subdomain']).select()

    // _formatMeta(list)
    const obj = {}
    for (let v of list) {
      let domain = v.domain
      if (think.isEmpty(domain) && !think.isEmpty(v.subdomain)) {
        domain = v.subdomain
      }
      // 处理 org 的 meta 信息
      for (let meta of v.metas) {
        if (meta.meta_key === 'basic') {
          v.basic = JSON.parse(meta.meta_value)
          v = Object.assign(v, v.basic)
          Reflect.deleteProperty(v, 'basic')
        }
      }
      Reflect.deleteProperty(v, 'metas')
      obj[domain] = v.id

      // 处理 机构的 apps meta 信息
      for (let app of v.apps) {
        if (!Object.is(app.metas, undefined)) {
          _formatOneMeta(app)
          app = Object.assign(app, app.meta.info)
          Reflect.deleteProperty(app, 'meta')
        }
      }
      _formatMeta(v.apps)
      await think.cache(domain.toString(), v)
    }
    return obj
  }
}
