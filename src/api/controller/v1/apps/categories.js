/* eslint-disable no-undef,no-warning-comments */
const BaseRest = require('./Base')
// const {transliterate, slugify}  = require('transliteration')
const slugify = require('limax')

module.exports = class extends BaseRest {

  // API
  // GET /apps/$app/categories
  // Get a list of app's categories
  async indexAction () {
    if (this.isPost) {
      return this.fail()
    }
    // 获取分类
    const data = await this.getTermsByTaxonomy('category')
    // this.success(data)
    return this.success({
      found: data.length,
      categories: data
    })
  }

  /**
   * 添加新分类 Category
   * @returns {Promise.<*>}
   */
  async newAction () {
    if (this.isPost) {
      const data = this.post()

      if (think.isEmpty(data) || think.isEmpty(data.name)) {
        return this.fail(400, '没有提交要更新的内容');
      }
      const slug = data.slug
      if (think.isEmpty(slug)) {
        data.slug = slugify(data.name)
      }
      const term = await this.model('taxonomy', {appId: this.appId}).findTermBySlug('category', data.slug.toString())
      if (!think.isEmpty(term)) {
        return this.fail(400, '分类信息已存在')
      }
      // 过滤关键词
      data.name = this.tc.filter(data.name)
      if (!think.isEmpty(data.description)) {
        data.description = this.tc.filter(data.description)
      } else {
        data.description = data.name
      }
      const res = await this.model('terms', {appId: this.appId}).add(data)
      if (!think.isEmpty(res)) {
        data.term_id = res
        data.taxonomy = 'category'
        await this.model('term_taxonomy', {appId: this.appId}).add(data)
      }
      // 更新 meta 信息
      if (!Object.is(data.meta, undefined)) {
        const termMetaModel = this.model('termmeta', {appId: this.appId})
        await termMetaModel.save(data.term_id, data.meta)
      }
      // 更新缓存
      await this.model('taxonomy', {appId: this.appId}).allTerms(true)

      // TODO: 重新查询，这里要处理为缓存
      const newTerm = await this.model('taxonomy', {appId: this.appId}).findTermBySlug('category', data.slug)
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


  async getTermBySlug (slug) {
    const term = await this.model('taxonomy', {appId: this.appId}).getTermBySlug(slug)
    const metaModel = this.model('postmeta', {appId: this.appId})
    // 如果有封面 默认是 thumbnail 缩略图，分类封面特色图片 featured_image
    if (!Object.is(term.meta, undefined)) {
      if (!Object.is(term.meta._thumbnail_id)) {
        term.featured_image = await metaModel.getAttachment('file', term.meta._thumbnail_id)
      }
    }
    return term
  }

  /**
   * 获取全部分类法
   * @returns {Promise.<*>}
   */
  async getAllTaxonomies () {
    const taxonomies = await this.model('taxonomy', {appId: this.appId}).allTaxonomies()
    return taxonomies
  }

  /**
   * 根据分类方法查询分类列表
   * @param taxonomy
   * @returns {Promise.<*>}
   */

  async getTermsByTaxonomy (taxonomy) {
    const taxonomyModel = this.model('taxonomy', {appId: this.appId})
    const terms = await taxonomyModel.getTerms(taxonomy)
    for (const item of terms) {
      item.url = ''
      const metaModel = this.model('postmeta', {appId: this.appId})
      // 如果有封面 默认是 thumbnail 缩略图，分类封面特色图片 featured_image
      if (!Object.is(item.meta, undefined)) {
        if (!Object.is(item.meta._thumbnail_id, undefined)) {
          item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
        }
      }
    }

    return terms
  }

  async getObjectsInTermsByLimit (terms) {
    const taxonomyModel = this.model('taxonomy', {appId: this.appId})
    const objects = await taxonomyModel.getObjectsInTermsByLimit(2)
    return objects
  }

  // async exists () {
  //   const term = this.get('term')
  //   let taxonomy = this.get('taxonomy')
  //   if (think.isEmpty(taxonomy)) {
  //     taxonomy = 'category'
  //   }
  // }
}
