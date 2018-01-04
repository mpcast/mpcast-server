/* eslint-disable no-console,prefer-reflect */
const path = require('path');
const assert = require('assert');
const tc = require('text-censor')

module.exports = class extends think.Controller {
  constructor(ctx) {
    super(ctx);
    // 从缓存中获取机构列表

    this.resource = this.getResource();
    this.id = this.getId();
    assert(think.isFunction(this.model), 'this.model must be a function');
    this.modelInstance = this.model(this.resource);
    this.tc = tc
  }
  async __before() {
    const appId = this.get('appId')
    if (think.isEmpty(appId)) {
      return this.fail('App params is Empty.')
    }
    const isDeal = await this.dealApp(appId)
    if (!isDeal) {
      return this.fail('App is Not found')
    }
  }

  /**
   * 处理并检测 app
   * @param appId
   * @returns {Promise.<boolean>}
   */
  async dealApp (appId) {
    const appsModel = this.model('apps')
    const app = await appsModel.get(appId)
    if (!think.isEmpty(app)) {
      this.app = app
      this.appId = app.id
      this.cachePrefix = 'picker_' + this.appId + '_'
      this.modelInstance = this.model(this.resource, {appId: this.appId})
      this.options = await this.model('options', {appId: this.appId}).get()
      return true
    }
    return false
  }

  async getRoles (user) {}
  /**
   * get resource
   * @return {String} [resource name]
   */
  getResource() {
    const filename = this.__filename || __filename;
    const last = filename.lastIndexOf(path.sep);
    return filename.substr(last + 1, filename.length - last - 4);
  }
  getId() {
    const id = this.get('id');
    if (id && (think.isString(id) || think.isNumber(id))) {
      return id;
    }
    const last = this.ctx.path.split('/').slice(-1)[0];
    if (last !== this.resource) {
      return last;
    }
    return '';
  }

  __call() {
    return this.fail()
  }
}
