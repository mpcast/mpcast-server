const BaseRest = require('./_rest.js');
module.exports = class extends BaseRest {
  async getAction() {
    const key = this.get('key')
    // console.log(key + "xxxxx")
    // console.log('get options ...')
    let data = await this.modelInstance.get()
    // console.log(JSON.stringify(data))
    if (!think.isEmpty(key)) {
      // const option = await think._.findKey(data, key)
      return this.success(data[key])
    }
    return this.success(data)
    // let key = this.get('key')
    // let data;
    // data = await this.modelInstance.where({'key': key}).find();
    // return this.success(data)
    // if (this.id) {
    //   const pk = this.modelInstance.pk;
    //   data = await this.modelInstance.where({[pk]: this.id}).find();
    //   return this.success(data);
    // }
    // data = await this.modelInstance.select();
    // return this.success(data);
  }
};
