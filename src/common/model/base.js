module.exports = class extends think.Model {
  constructor(...args) {
    super(...args);
    this.appId = ''
    if (this.config.appId !== undefined) {
      this.appId = this.config.appId + '_'
    }
    // this.prefix = 'picker_' + this.appId + '_'
  }

  get tablePrefix() {
    return 'picker_' + this.appId;
  }
  /**
   * 处理 metas
   *
   * @param post
   * @returns {Promise.<*>}
   */
  async _formatMeta(list) {
    const _items = [];

    for (const item of list) {
      item.meta = {};
      if (item.metas.length > 0) {
        for (const meta of item.metas) {
          // console.log(meta.meta_key + ":" + meta.meta_value);
          item.meta[meta.meta_key] = meta.meta_value;
        }
      }
// eslint-disable-next-line prefer-reflect
      delete item.metas;
      _items.push(item);
    }
    return _items;
  }
}
