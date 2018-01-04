/* eslint-disable prefer-reflect */
const BaseRest = require('./_rest')
module.exports = class extends BaseRest {

  async getAction() {
    console.log('apps ....')
    let orgId = this.get('orgId')
    if (!think.isEmpty(orgId)) {
      // const data = await this.modelInstance.findByOrgId(orgId)
      const list = await this.model('apps').where({org_id: orgId}).select()
      await this._format_Meta(list)
      // console.log(data)
      return this.success(list)
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

  async _format_Meta(list) {
    let _items = [];

    for (let item of list) {
      item.meta = {};
      if (item.metas.length > 0) {
        for (let meta of item.metas) {
          if (meta.meta_key === 'basic') {
            console.log('====' + meta.meta_key)
            item.meta[meta.meta_key] = JSON.parse(meta.meta_value);
          } else {
            item.meta[meta.meta_key] = meta.meta_value;
          }
        }
      }
      delete item.metas;
      _items.push(item);
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
