/* eslint-disable no-undef,no-warning-comments */
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
      return this.fail(400, 'Slug is Empty!')
    }
    if (this.isGet) {
      if (!think.isEmpty(slug)) {
        const term = await taxonomyModel.findTermBySlug('category', slug)
        return this.success(term)
      }
    }

    // POST ACTION
    // Params name:description:parent
    if (this.isPost) {
      const data = this.post()
      if (think.isEmpty(data)) {
        return this.fail(400, '未提交要更新的内容');
      }
      const termData = await taxonomyModel.findTermBySlug('category', slug)
      // console.log(JSON.stringify(termData))
      if (think.isEmpty(termData)) {
        return this.fail(404, '分类信息未找到.')
      }
      // 如果存在即更新
      // if (termData.name !== data.name) {
      //   return this.fail(400, '名称已存在!');
      // }
      // console.log(JSON.stringify(data))
      // console.log(slugify(`${data.name}`))
      if (!think.isEmpty(data.name)) {
        if (termData.name !== data.name) {
          data.slug = slugify(data.name)
        } else {
          data.slug = slug
        }
      }

      // 更新分类信息
      if (!Object.is(data.name, undefined) && !think.isEmpty(data.name)) {
        await this.model('terms', {appId: this.appId}).thenUpdate({
          name: data.name,
          slug: data.slug
        }, {slug: slug})
      }
      if (!Object.is(data.meta, undefined)) {
        const termMetaModel = this.model('termmeta', {appId: this.appId})
        await termMetaModel.save(termData.term_id, data.meta)
      }
      // 更新分类方法信息
      if (!think.isEmpty(data.description) || !think.isEmpty(data.parent)) {
        await this.model('term_taxonomy', {appId: this.appId}).thenUpdate(data, {
          term_id: termData.term_id
        })
      }
      // 更新缓存
      await this.model('taxonomy', {appId: this.appId}).allTerms(true)

      // 查询更新后的分类返回
      const newTerm = await taxonomyModel.findTermBySlug('category', data.slug)
      const metaModel = this.model('postmeta', {appId: this.appId})
      if (!Object.is(newTerm.meta, undefined)) {
        if (!Object.is(newTerm.meta._thumbnail_id)) {
          newTerm.featured_image = await metaModel.getAttachment('file', term.meta._thumbnail_id)
        }
      }
      return this.success(newTerm)
    }
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

  async updateAction () {
  }

  //
  // DELETE ACTIONS

  /**
   * 删除分类
   * @returns {Promise.<*>}
   */
  async deleteAction () {
    const slug = this.get('slug')
    const taxonomyModel = this.model('taxonomy', {appId: this.appId})
    const data = await taxonomyModel.findTermBySlug('category', slug)
    if (think.isEmpty(data)) {
      return this.fail(404, '分类信息不存在！')
    }
    if (data.term_id.toString() === this.options.default.term) {
      return this.fail(401, '默认分类不可以删除!')
    }

    // 处理与分类相关的内容
    await taxonomyModel.deleteTerm(data.term_id, data.term_taxonomy_id)
    // 更新缓存
    await this.model('taxonomy', {appId: this.appId}).allTerms(true)
    return this.success({
      slug: slug
    })
  }


  async exists () {
    const term = this.get('term')
    let taxonomy = this.get('taxonomy')
    if (think.isEmpty(taxonomy)) {
      taxonomy = 'category'
    }
  }
}
