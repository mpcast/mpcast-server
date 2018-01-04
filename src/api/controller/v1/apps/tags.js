/* eslint-disable no-undef,no-warning-comments */
const BaseRest = require('./Base')
const slugify = require('limax')

module.exports = class extends BaseRest {

  // API
  // GET /apps/$app/categories
  // Get a list of app's categories
  async indexAction () {
    // 获取分类
    const data = await this.getTermsByTaxonomy('post_tag')
    return this.success({
      found: data.length,
      tags: data
    })
  }

  /**
   * 添加新标签
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
      const term = await this.model('taxonomy', {appId: this.appId}).findTermBySlug('post_tag', data.slug.toString())
      if (!think.isEmpty(term)) {
        return this.fail(400, '标签已存在')
      }
      // 过滤关键词
      data.name = this.tc.filter(data.name)
      if (!think.isEmpty(data.description)) {
        data.description = this.tc.filter(data.description)
      } else {
        data.description = data.name
      }
      const res = await this.model('terms', {appId: this.appId}).add(data)
      console.log(JSON.stringify(res))
      if (!think.isEmpty(res)) {
        data.term_id = res
        data.taxonomy = 'post_tag'
        Reflect.deleteProperty(data, 'id')
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
      const newTerm = await this.model('taxonomy', {appId: this.appId}).findTermBySlug('post_tag', data.slug)
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
  // GET ACTIONS
  //
  async getAction () {
    const slug = this.get('slug')
    if (!think.isEmpty(slug)) {
      const term = await this.getTermBySlug(slug)
      return this.success(term)
    }
    const type = this.get('type')
    // 根据分类的分类方法获取分类
    if (!think.isEmpty(type)) {
      const terms = await this.getTermsByTaxonomy(type)
      return this.success(terms)
    }
    const taxonomies = await this.getAllTaxonomies()
    return this.success(taxonomies)
  }

  async getTermBySlug (slug) {
    const term = await this.model('taxonomy', {appId: this.appId}).getTermBySlug(slug)
    const metaModel = this.model('postmeta', {appId: this.appId})
    // 如果有封面 默认是 thumbnail 缩略图，分类封面特色图片 featured_image
    if (!Object.is(term.meta._thumbnail_id, undefined)) {
      term.featured_image = await metaModel.getAttachment('file', term.meta._thumbnail_id)
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

  // POST ACTION

  /**
   * update resource
   * @return {Promise} []
   */
  async putAction () {
    // if (!this.id) {
    //   return this.fail('params error');
    // }
    const data = this.post()

    if (think.isEmpty(data)) {
      return this.fail('data is empty');
    }

    await this.model('terms', {appId: this.appId}).update(data)
    if (!Object.is(data.meta, undefined)) {
      const termMetaModel = this.model('termmeta', {appId: this.appId})
      await termMetaModel.save(data.term_id, data.meta)
    }
    // 更新缓存
    await this.model('taxonomy', {appId: this.appId}).allTerms(true)
    return this.success()

    // const pk = this.modelInstance.pk;
    // const pk = await this.modelInstance.getPk();
    // const data = this.post();
    // Relation.deleteProperty(data, 'pk')
// eslint-disable-next-line prefer-reflect
//     delete data[pk];

    // 更新
    // const currentTime = new Date().getTime();
    // data.modified = currentTime
    //
    // await this.modelInstance.where({[pk]: this.id}).update(data);
    // // }
    // // 更新 meta 图片数据
    // if (!Object.is(data.meta, undefined)) {
    //   const metaModel = await this.model('postmeta', {appId: this.appId})
    //   // 保存 meta 信息
    //   await metaModel.save(this.id, data.meta)
    // }
    // await this.model('taxonomy', {appId: this.appId}).relationships(this.id, data.term)

    // return this.success({affectedRows: rows});
    // 返回的状态
    // return this.success()
  }

  async updateAction () {}
  //
  // DELETE ACTIONS
  //
  async deleteCategory () {
    const termId = this.get('id')
    this.dao = this.model('taxonomy', {appId: this.appId})
    // this.dao.deleteTerm(termId, 'category')
  }
  async perDeleteTerm () {
    // Update children to point to new parent
    // if is_taxonomy_hierarchical(taxonomy)
  }

  async exists () {
    const term = this.get('term')
    let taxonomy = this.get('taxonomy')
    if (think.isEmpty(taxonomy)) {
      taxonomy = 'category'
    }
  }
}
