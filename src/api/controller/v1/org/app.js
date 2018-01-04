/* eslint-disable prefer-reflect */
const BaseRest = require('./_rest')
module.exports = class extends BaseRest {

  async getAction() {
    let orgId = this.get('orgId')
    if (!think.isEmpty(orgId)) {
      const data = await this.model('apps').select()
      return this.success(data)
    }
    return this.fail()

    // let id = this.get('orgId')
    // if (!think.isEmpty(id)) {
    //   try {
    //     const data = await this.model('org').where({[this.modelInstance.pk]: id}).find();
    //     for (let meta of data.metas) {
    //       if (meta.meta_key === 'basic') {
    //         data.basic = JSON.parse(meta.meta_value)
    //       }
    //     }
    //     delete data.metas;
    //     return this.success(data);
    //   } catch (e) {
    //     return this.fail()
    //   }
    // } else {
    //   let list = await this.model('org').select()
    //   return this.success(list)
    // }
  }

  async _format_Meta(posts) {
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

  async postAction() {
    // 机构开通
    // const data = this.post()
    // 获取 orgId
    const orgId = 1
    let db = this.service('orginit', {orgId: 1})
    db.create()
  }
}
