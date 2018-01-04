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

  async get(appId) {
    let apps = await think.cache('apps')
    if (think.isEmpty(apps)) {
      apps = await this.list()
    }
    const app = await think._.find(apps, ['id', appId.toString()])

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
  async list() {
    const apps = await this.select()
    _formatMeta(apps)
    for (let app of apps) {
      if (!think.isEmpty(app.meta.info)) {
        app = Object.assign(app, app.meta.info)
      }
      Reflect.deleteProperty(app, 'meta')
    }
    await think.cache('apps', apps)
    return apps
  }
}
