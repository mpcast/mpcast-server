/* eslint-disable no-undef,no-warning-comments */
const BaseRest = require('../Base')
module.exports = class extends BaseRest {

  async indexAction () {
    const taxonomy = this.get('taxonomy')
    const slug = this.get('slug')

    if (think.isEmpty(taxonomy) || think.isEmpty(slug)) {
      return this.fail('Term Data is Error!')
    }
    // 根据 Slug 与分类方法获取分类信息
    if (this.isGet) {
      const term = await this.model('taxonomy', {appId: this.appId}).findTermBySlug(taxonomy, slug)
      const metaModel = this.model('postmeta', {appId: this.appId})
      // 如果有封面 默认是 thumbnail 缩略图，分类封面特色图片 featured_image
      if (!Object.is(term.meta, undefined)) {
        if (!Object.is(term.meta._thumbnail_id, undefined)) {
          term.featured_image = await metaModel.getAttachment('file', term.meta._thumbnail_id)
        }
      }
      return this.success(term)
    }
    // 根据 Slug 与分类方法更新分类信息
    if (this.isPost) {
      const data = this.post()

      if (think.isEmpty(data)) {
        return this.fail(400, '没有提交要更新的内容');
      }
      const term = await this.model('taxonomy', {appId: this.appId}).findTermBySlug(taxonomy, slug)
      if (think.isEmpty(term)) {
        return this.fail(404, '分类不存在')
      }
      if (!Object.is(data.name, undefined)) {
        if (data.name === term.name) {
          return this.fail(409, '分类名已存在')
        }
        // 过滤关键词
        data.name = this.tc.filter(data.name)
        await this.model('terms', {appId: this.appId}).where({
          id: term.id
        }).update(data)
      }
      if (!Object.is(data.description, undefined)) {
        data.description = this.tc.filter(data.description)
        await this.model('term_taxonomy', {appId: this.appId}).where({
          term_id: term.id
        }).update(data)
      }

      // 更新 meta 信息
      if (!Object.is(data.meta, undefined)) {
        const termMetaModel = this.model('termmeta', {appId: this.appId})
        await termMetaModel.save(data.term_id, data.meta)
      }
      // 更新缓存
      await this.model('taxonomy', {appId: this.appId}).allTerms(true)

      // TODO: 重新查询，这里要处理为缓存
      const newTerm = await this.model('taxonomy', {appId: this.appId}).findTermBySlug(taxonomy, slug)
      const metaModel = this.model('postmeta', {appId: this.appId})
      // 如果有封面 默认是 thumbnail 缩略图，分类封面特色图片 featured_image
      if (!Object.is(term.meta, undefined)) {
        if (!Object.is(term.meta._thumbnail_id, undefined)) {
          term.featured_image = await metaModel.getAttachment('file', term.meta._thumbnail_id)
        }
      }
      return this.success(newTerm)
    }
  }
  //
  async getTermBySlug (slug) {
    const term = await this.model('taxonomy', {appId: this.appId}).getTermBySlug(slug)
    const metaModel = this.model('postmeta', {appId: this.appId})
    // 如果有封面 默认是 thumbnail 缩略图，分类封面特色图片 featured_image
    if (!Object.is(term.meta._thumbnail_id, undefined)) {
      term.featured_image = await metaModel.getAttachment('file', term.meta._thumbnail_id)
    }
    return term
  }

  async getObjectsInTermsByLimit (terms) {
    const taxonomyModel = this.model('taxonomy', {appId: this.appId})
    const objects = await taxonomyModel.getObjectsInTermsByLimit(2)
    return objects
  }
}
