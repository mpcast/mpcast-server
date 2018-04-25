/* eslint-disable no-return-await,no-undef */
module.exports = class extends think.Model {
  get relation () {
    return {
      metas: {
        type: think.Model.HAS_MANY,
        model: 'appmeta',
        fKey: 'app_id'
      }
    };
  }

  async findByOrgId (orgId) {
    const list = await this.where({org_id: orgId}).field(['id', 'org_id', 'domain', 'subdomain']).select()
    _formatMeta(list)
    return list
  }

  async get (appId) {
    let apps = await think.cache('apps')
    if (think.isEmpty(apps)) {
      apps = await this.list()
    }
    const app = await think._.find(apps, ['id', appId])

    if (!think.isEmpty(app)) {
      // _formatOneMeta(app)
      return app
    } else {
      return null
    }
  }

  /**
   * 全部应用列表
   * @returns {Promise.<*>}
   */
  async list () {
    const apps = await this.select()
    _formatMeta(apps)

    for (let app of apps) {
      let domain = app.domain
      if (think.isEmpty(domain) && !think.isEmpty(app.subdomain)) {
        domain = app.subdomain
      }
      if (!think.isEmpty(app.meta.info)) {
        app = Object.assign(app, app.meta.info)
      }
      Reflect.deleteProperty(app, 'meta')
    }

    await think.cache('apps', apps)
    return apps
  }


  // async lista () {
  //   const map = {}
  //   const list = await this.where(map).field(['id', 'domain', 'subdomain']).select()
  //
  //   // _formatMeta(list)
  //   const obj = {}
  //   for (let v of list) {
  //     let domain = v.domain
  //     if (think.isEmpty(domain) && !think.isEmpty(v.subdomain)) {
  //       domain = v.subdomain
  //     }
  //     // 处理 org 的 meta 信息
  //     for (let meta of v.metas) {
  //       if (meta.meta_key === 'basic') {
  //         v.basic = JSON.parse(meta.meta_value)
  //         v = Object.assign(v, v.basic)
  //         Reflect.deleteProperty(v, 'basic')
  //       }
  //     }
  //     Reflect.deleteProperty(v, 'metas')
  //     obj[domain] = v.id
  //
  //     // 处理 机构的 apps meta 信息
  //     for (let app of v.apps) {
  //       if (!Object.is(app.metas, undefined)) {
  //         _formatOneMeta(app)
  //         app = Object.assign(app, app.meta.info)
  //         Reflect.deleteProperty(app, 'meta')
  //       }
  //     }
  //     _formatMeta(v.apps)
  //     await think.cache(domain.toString(), v)
  //   }
  //   return obj
  // }

}



