/* eslint-disable prefer-reflect */
const BaseRest = require('./_rest')
module.exports = class extends BaseRest {

  async getAction() {
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
    // const pk = await this.modelInstance.getPk();
    // const data = this.post();
    // delete data[pk];
    // if (think.isEmpty(data)) {
    //   return this.fail('data is empty');
    // }
    // const insertId = await this.modelInstance.add(data);
    // return this.success({id: insertId});
  }
}
