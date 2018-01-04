/* eslint-disable no-undef */
const BaseRest = require('../Base')
const slugify = require('limax')

module.exports = class extends BaseRest {
  /**
   * GET /apps/$app/categories/slug:$category
   * Get information about a single category.
   * @returns {Promise.<*>}
   */
  async indexAction () {
    const slug = this.get('slug')
    const taxonomyModel = this.model('taxonomy', {appId: this.appId})

    if (think.isEmpty(slug)) {
      return this.fail('Slug is Empty!')
    }
    if (this.isGet) {
      if (!think.isEmpty(slug)) {
        const term = await this.getTermBySlug(slug)
        return this.success(term)
      }
    }

    // POST ACTION
    // Params name:description:parent
    if (this.isPost) {
      const data = this.post()
      if (think.isEmpty(data)) {
        return this.fail('data is empty');
      }
      const term = await taxonomyModel.getTermBySlug(slug)
      // const term = await taxonomyModel.findTermByName('post_tag', data.name.toString())
      // if (!think.isEmpty(term)) {
      //   return this.fail(400, '标签已存在')
      // }
      // 如果存在即更新
      if (!think.isEmpty(term)) {
        if (term.name === data.name) {
          return this.fail(400, '名称已存在!');
        }
        // if (think.isEmpty(slug)) {
        //   data.slug = slugify(data.name)
        // }
        data.slug = slugify(data.name)
        // 更新分类信息
        if (!Object.is(data.name, undefined) && !think.isEmpty(data.name)) {
          await this.model('terms', {appId: this.appId}).thenUpdate({
            name: data.name,
            slug: data.slug
          }, {slug: slug})
        }
        if (!Object.is(data.meta, undefined)) {
          const termMetaModel = this.model('termmeta', {appId: this.appId})
          await termMetaModel.save(data.term_id, data.meta)
        }
        // 更新分类方法信息
        if (!think.isEmpty(data.description) || !think.isEmpty(data.parent)) {
          await this.model('term_taxonomy', {appId: this.appId}).thenUpdate(data, {
            term_id: term.id
          })
        }
        // 更新缓存
        await this.model('taxonomy', {appId: this.appId}).allTerms(true)

        // 查询更新后的分类返回
        // const newTerm = await taxonomyModel.getTermBySlug(slug)
        const newTerm = await taxonomyModel.findTermBySlug('post_tag', data.slug)
        return this.success(newTerm)
      } else {
        return this.fail(404, 'Term is not found.')
      }
    }
  }

  /**
   * 按 Slug 删除
   * @returns {Promise.<void>}
   */
  async deleteAction () {
    const slug = this.get('slug')
    const taxonomyModel = this.model('taxonomy', {appId: this.appId})
    const data = await taxonomyModel.findTermBySlug('post_tag', slug)
    console.log(data)
    if (think.isEmpty(data)) {
      return this.fail(404, '分类信息不存在！')
    }

    await taxonomyModel.deleteTag(data.term, data.taxonomy)
    // 处理分类下面的内容

    // 处理是否有子分类

    return this.success({slug: slug})
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
      if (!Object.is(item.meta._thumbnail_id, undefined)) {
        item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
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
