const Base = require('./base');

const redisCache = require('think-cache-redis');

module.exports = class extends Base {
  constructor (...args) {
    super(...args);
    this.cacheKey = this.tablePrefix + 'options';
  }

  async get (flag) {
    if (flag) {
      await think.cache(this.cacheKey, null)
    }
    const ret = await think.cache(this.cacheKey)

    if (think.isEmpty(ret)) {
      const data = await this.select();
      const result = {};
      data.forEach(item => {
        result[item.key] = JSON.parse(item.value);
      });
      // await think.cache(this.cacheKey, JSON.stringify(result))
      await think.cache(this.cacheKey, result)
    }
    const _options = await think.cache(this.cacheKey)
    return _options
  }

  async removeSticky (id) {
    const options = await this.get()
    let stickys = options.stickys
    if (stickys.includes(id)) {
      for (let i = 0; i < stickys.length; i++) {
        if (stickys[i] === id) {
          stickys.splice(i, 1)
        }
      }
      await this.saveStickys(stickys)
    }
  }

  async addSticky (id) {
    const options = await this.get()
    let stickys = options.stickys
    if (!stickys.includes(id)) {
      stickys.unshift(id)
      await this.saveStickys(stickys)
    }
  }

  async saveStickys (stickys) {
    const res = await this.where({
      key: 'stickys'
    }).update({
      value: JSON.stringify(stickys)
    })

    if (res) {
      const options = await this.get(true)
      return options
    }
  }

  async updateOptions (key, value) {

    console.log(key + ": " + value);

    const data = think.isObject(key) ? think.extend({}, key) : {[key]: value};
    let cacheData = await think.cache(this.cacheKey, undefined, this.cacheOptions);

    // console.log(JSON.stringify(cacheData))
    // update picker_resume.picker_options set value = json_set(value,'$.current_theme', 'limitless') where `key` = 'site';
    if (think.isEmpty(cacheData)) {
      cacheData = await this.get();
    }
    const changedData = {};
    for (const key in data) {
      if (data[key] !== cacheData[key]) {
        changedData[key] = data[key];
      }
    }

    // console.log(JSON.stringify(changedData) + "-----")
    const json_sql = `update ${this.cacheKey} set value = json_set(value,'$.${value.key}', '${value.value}') where \`key\` = '${key}'`;

    // console.log(json_sql)
    // console.log(JSON.stringify(changedData))
    // data is not changed
    if (think.isEmpty(changedData)) {
      return;
    }
    const p1 = think.cache(this.cacheKey, think.extend(cacheData, changedData), this.cacheOptions);

    const promises = [p1];
// eslint-disable-next-line guard-for-in
    for (let key in changedData) {
      const value = changedData[key];
      const exist = await this.where({key: key}).count('key');
      let p;
      this.execute(json_sql);
      // let json_sql = `update picker_resume.picker_options set value = json_set(value,'$.${key}', '${value}') where \`key\` = \`${key}\``;
      // if (exist) {
      // this.execute(update picker_resume.picker_options set value = json_set(value,'$.current_theme', 'limitless') where `key` = 'site';)
      // p = this.where({key: key}).update({value: value});
      // } else {
      //     p = this.add({key, value});
      // }
      promises.push(p);
    }
    await Promise.all(promises);
    // console.log(JSON.stringify(p1) +"======")

    const ret = await this.get(true)

    return ret;
  }


  /**
   * 获取网站配置
   * @returns {{}}
   */
  async lists () {
    const map = {}
    map.status = 1;
    const list = await this.where(map).order("sort ASC").field(["name", "value", "type"]).select();
    const obj = {}
    list.forEach(v => {
      if (v.value.search(/\r\n/ig) > -1 && v.type != 2) {
        v.value = v.value.split("\r\n");
        const obj = {}
        v.value.forEach(n => {
          n = n.split(":");
          obj[n[0]] = n[1];
        })

        v.value = obj;
      }
      obj[v.name] = v.value;


    })
    return obj;
  }
};
