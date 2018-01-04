/* eslint-disable prefer-reflect,no-return-await,no-undef */
const BaseRest = require('./_rest')

module.exports = class extends BaseRest {
  //
  // GET ACTIONS
  //
  async getAction () {
    const action = this.get('action')
    switch (action) {
      case 'subdomain_validation': {
        const subdomain = this.get('subdomain')
        return this.subdomainValidation(subdomain)
      }
      default: {
        break
      }
    }
    return await this.orgInfo()
  }

  async orgInfo () {
    try {
      const data = await this.model('org').where({[this.modelInstance.pk]: this.orgId}).find();
      for (let meta of data.metas) {
        if (meta.meta_key === 'basic') {
          data.basic = JSON.parse(meta.meta_value)
        }
      }
      delete data.metas;
      return this.success(data);
    } catch (e) {
      return this.fail()
    }
  }

  /**
   * 验证机构名称 用于二级域名
   * @param subdomain
   * @returns {Promise.<*>}
   */
  // api/teams/subdomain_validation?subdomain=vanq
  async subdomainValidation (subdomain) {
    const orgs = await think.cache('orgs')
    const validation = await think._.has(orgs, subdomain)
    if (!validation) {
      return this.success()
    } else {
      return this.fail('名称已存在！')
    }
  }

  //
  // POST ACTIONs
  //
  async _format_Meta (posts) {
    let _items = [];

    for (let post of posts) {
      post.meta = {};
      if (post.metas.length > 0) {
        for (let meta of post.metas) {
          // console.log(meta.meta_key + ":" + meta.meta_value);
          post.meta[meta.meta_key] = meta.meta_value;
        }
      }
      delete post.metas;
      _items.push(post);
    }
    return _items;
  }

  async postAction () {
    // 应用建设开通
    const db = think.service('installApp', 'common', {appId: think.id.generate()})
    await db.create()
  }


}
