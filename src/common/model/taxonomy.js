/* eslint-disable no-return-await,no-undef,default-case */
const Base = require('./base');

module.exports = class extends Base {
  get relation () {
    return {
      metas: {
        type: think.Model.HAS_MANY,
        model: 'termmeta',
        // rModel: 'usermeta',
        fKey: 'term_id',
        field: "term_id,meta_key,meta_value"
      }
    };
  }

  /**
   * 根据类别的分类方法获取分类
   * @param taxonomy
   * @returns {Promise.<Array>}
   */
  async getTerms (taxonomy) {
    const allTerms = await this.allTerms()
    // const allTaxonomies = await this.allTaxonomies()
    // console.log(allTerms)

    // 按分类方法查询分类信息
    const categorys = await think._.filter(allTerms, {'taxonomy': taxonomy})

    // const _terms = []
    // categorys.forEach((item) => {
    //   _terms.push(
    //     Object.assign({},
    //       item, think._.find(allTerms, {id: item.term_id})))
    // })
    return categorys
  }

  /**
   * 按分类法查询指定数量内容,主要用于 top 查询
   * @param term_ids
   * @param taxonomies
   * @param limit
   * @returns {Promise.<Array>}
   */
  async getAllObjectsInTerms (term_ids, taxonomies = 'category') {
    const _term_relationships = this.model("term_relationships", {appId: this.appId})
    let objects
    objects = await _term_relationships.join({
      table: "term_taxonomy",
      join: "inner",
      as: "tt",
      on: ["term_taxonomy_id", "term_id"]

    }).field("object_id").where("tt.taxonomy IN ('" + taxonomies + "') AND tt.term_id IN (" + term_ids + ")").select();
    const ids = [];
    for (const obj of objects) {
      ids.push(obj.object_id);
    }
    return ids;
  }

  /**
   * 按分类法查询指定数量内容,主要用于 top 查询
   * @param term_ids
   * @param taxonomies
   * @param limit
   * @returns {Promise.<Array>}
   */
  async getObjectsInTermsByLimit (term_ids, taxonomies = 'category', limit = 6) {
    const _term_relationships = this.model("term_relationships", {appId: this.appId})
    let objects
    objects = await _term_relationships.join({
      table: "term_taxonomy",
      join: "inner",
      as: "tt",
      on: ["term_taxonomy_id", "term_id"]

    }).field("object_id").where("tt.taxonomy IN ('" + taxonomies + "') AND tt.term_id IN (" + term_ids + ")").limit(limit).select();
    const ids = [];
    for (const obj of objects) {
      ids.push(obj.object_id);
    }
    return ids;
  }

  async getObjectsInTermsByPage (term_ids, page = 1, pagesize = 10, taxonomies = 'category') {
    // SELECT p.id, p.title, p.content FROM picker_S11SeYT2W_posts as p, picker_S11SeYT2W_term_relationships as pr, picker_S11SeYT2W_term_taxonomy as pt WHERE p.id=object_id and pr.term_taxonomy_id = pt.term_id and p.status = 'publish' and pt.term_id IN(1,3,4) and taxonomy = 'category' order by object_id desc;
    const _posts = this.model('posts', {appId: this.appId})
    // let objects = await _posts.join([
    //   'LEFT JOIN term_relationships AS tt ON posts.id=tt.object_id',
    //   'LEFT JOIN term_taxonomy as tr on tt.term_taxonomy_id = tr.term_id'
    // ]).field(['id', 'title', 'content', 'author', 'status']).where(`tr.term_id IN('${term_ids}') and tr.taxonomy = 'category' and status = 'publish'`).order('id DESC').select()
    const objects = await _posts.join({
      term_relationships: {
        as: 'tr',
        on: ['id', 'tr.object_id']
      }
      // table: 'term_relationships',
      // join: 'left',
      // as: 'tr',
    }, {
      term_taxonomy: {
        as: 'tt',
        on: ['tt.term_taxonomy_id', 'tt.term_id']
      }
      // table: 'term_taxonomy',
      // join: 'left',
      // as: 'tt',
    }).field(['id', 'title', 'content', 'author', 'status']).where(`tr.term_id IN ('${term_ids}') AND tt.taxonomy IN ('${taxonomies}') AND status='publish'`).order('id DESC').page(page, pagesize).countSelect()

    return objects
    // objects = await _posts
  }

  /**
   * 根据分类方法分页查询内容
   * @param term_ids
   * @param taxonomies
   * @param page
   * @param limit
   * @returns {Promise.<*>}
   */
  async getObjectIdsInTermsByPage (term_ids, page = 1, pagesize = 10, taxonomies = 'category') {
    // console.log('llll分类法查找 ')
    const _term_relationships = this.model("term_relationships", {appId: this.appId})
    let objects
    // if (think.isEmpty(page)) {
    //   objects = await _term_relationships.join({
    //     table: "term_taxonomy",
    //     join: "inner",
    //     as: "tt",
    //     on: ["term_taxonomy_id", "term_id"]
    //
    //   }).field("object_id").where("tt.taxonomy IN ('" + taxonomies + "') AND tt.term_id IN (" + term_ids + ")").select();
    //   let ids = [];
    //   for (let obj of objects) {
    //     ids.push(obj.object_id);
    //   }
    //   return ids;
    // }

    objects = await _term_relationships.join({
      table: "term_taxonomy",
      join: "inner",
      as: "tt",
      on: ["term_taxonomy_id", "term_id"]

    }).field("object_id").where("tt.taxonomy IN ('" + taxonomies + "') AND tt.term_id IN (" + term_ids + ")").order('object_id DESC').page(page, pagesize).countSelect();
    // console.log(JSON.stringify(objects.data))
    const ids = [];
    // objects.data.forEach((value) => {
    //   console.log(value.object_id + '-----')
    //   ids.unshift(value.object_id);
    // })
    for (const obj of objects.data) {
      ids.push(obj.object_id);
    }
    // ids.reverse()
    Reflect.deleteProperty(objects, 'data')
    // delete objects.data;
    objects.ids = ids;
    // objects.ids = objects.ids.reverse()
    // console.log(ids)
    return objects;
  }

  /**
   * 查询内容的标签
   * @param object_id
   * @returns {Promise.<*>}
   */
  async findTagsByObject (object_id) {
    const taxonomy = 'post_tag'
    // 从缓存中提取到所有 term
    const all_terms = await this.allTerms();

    const _term_relationships = this.model("term_relationships", {appId: this.appId});

    // 查询内容关联的分类法 id == term_id
    const taxonomies = await _term_relationships.field('term_taxonomy_id as term_id').where({"object_id": object_id}).select();

    /**
     * 按 term_id 查询 term
     * @type {Array}
     * @private
     */
    const _terms = [];
    taxonomies.forEach((item) => {
      _terms.push(think._.filter(all_terms, {term_id: item.term_id, taxonomy: taxonomy}));
    });

    return await think._.flattenDeep(_terms);
  }

  /**
   * 按内容 id 查询分类信息
   * @param object_id
   * @returns {Promise.<void>}
   */
  async findCategoriesByObject (object_id) {
    const taxonomy = 'category'
    // 从缓存中提取到所有 term
    const all_terms = await this.allTerms();

    const _term_relationships = this.model("term_relationships", {appId: this.appId});

    // 查询内容关联的分类法 id == term_id
    const taxonomies = await _term_relationships.field('term_taxonomy_id').where({"object_id": object_id}).select();

    /**
     * 按 term_id 查询 term
     * @type {Array}
     * @private
     */
    const _terms = [];
    // console.log(JSON.stringify(all_terms))
    taxonomies.forEach((item) => {
      _terms.push(think._.filter(all_terms, {term_taxonomy_id: item.term_taxonomy_id, taxonomy: taxonomy}));
    });

    return await think._.flattenDeep(_terms);
    // return taxonomies
  }

  /**
   * 根据内容获取分类, 这里查询出来的分类未查询它所归属的分类法，仅类别的信息
   * @returns {Promise.<void>}
   */
  async getTermsByObject (object_id) {

    // 从缓存中提取到所有 term
    const all_terms = await this.allTerms();
    // console.log(JSON.stringify(all_terms))
    const _term_relationships = this.model("term_relationships", {appId: this.appId});

    // 查询内容关联的分类法 id == term_id
    const taxonomies = await _term_relationships.field('term_taxonomy_id as term_id').where({"object_id": object_id}).select();

    /**
     * 按 term_id 查询 term
     * @type {Array}
     * @private
     */
    const _terms = [];
    taxonomies.forEach((item) => {
      _terms.push(think._.filter(all_terms, {term_id: item.term_id}));
    });

    return await think._.flattenDeep(_terms);
  }

  /**
   * 获取内容格式
   *
   * @param object_id
   * @returns {Promise<Array>}
   */
  async getFormat (object_id) {

    // 从缓存中提取到所有 term
    const all_terms = await this.allTerms();
    // console.log(JSON.stringify(all_terms))
    const _term_relationships = this.model("term_relationships", {appId: this.appId});

    // 查询内容关联的分类法 id == term_id
    const taxonomies = await _term_relationships.field('term_taxonomy_id as term_id').where({"object_id": object_id}).select();

    /**
     * 按 term_id 查询 term
     * @type {Array}
     * @private
     */
    let postFormat = {}
    taxonomies.forEach((item) => {
      postFormat = think._.findLast(all_terms, function (o) {
        return (o.term_id === item.term_id && o.slug.indexOf('post-format') >= 0)
      })
    })
    return postFormat
  }

  /**
   * 获取全部分类
   * @param flag
   * @returns {Promise.<*>}
   */
  async allTerms (flag) {
    const cacheKey = this.tablePrefix + 'all_terms';
    if (flag) {
      await think.cache(cacheKey, null)
    }
    let ret = await think.cache(cacheKey)

    if (think.isEmpty(ret)) {
      /*      let _data = await this.model('terms', {appId: this.appId}).alias('t')
              .join({
                termmeta: {
                  as: 'tm',
                  on: ['t.id', 'tm.term_id']
                }
              })
              .join({
                term_taxonomy: {
                  as: 'tt',
                  on: ['t.id', 'tt.term_id']
                }
              }).field([
                't.id as term_id',
                't.name',
                't.slug',
                'tt.id as term_taxonomy_id',
                'tt.taxonomy',
                'tt.description',
                'tt.parent',
                'tt.count',
                'tm.*'
              ]).order('tt.id ASC').select()*/
      let _data = await this.model('terms', {appId: this.appId}).alias('t')
        .join({
          term_taxonomy: {
            as: 'tt',
            on: ['t.id', 'tt.term_id']
          }
        }).field([
          't.id as term_id',
          't.name',
          't.slug',
          'tt.id as term_taxonomy_id',
          'tt.taxonomy',
          'tt.description',
          'tt.parent',
          'tt.count',
        ]).order('tt.id ASC').select()

      // 处理 metas 信息
      const termmetaModel = this.model('termmeta', {appId: this.appId})
      // 为 IN 查询处理 ids
      const ids = []
      for (const item of _data) {
        ids.push(item.term_id)
      }
      const metaList = await termmetaModel.where({term_id: ['IN', ids]}).select()
      // 处理成组数据
      const metaGroup = think._.groupBy(metaList, 'term_id')
      for (const key of Object.keys(metaGroup)) {
        for (const item of _data) {
          if (item.term_id.toString() === key.toString()) {
            item.metas = metaGroup[key]
          }
        }
      }
      // 格式化 meta 信息
      _formatMeta(_data)
      _data = think._.sortBy(_data, 'meta._order')
      await think.cache(cacheKey, _data)
      ret = await think.cache(cacheKey)
    }
    return ret
  }

  /**
   * 获取全部分类方法
   * @param flag
   * @returns {Promise.<*>}
   */
  async allTaxonomies (flag) {
    const cacheKey = this.tablePrefix + 'all_term_taxonomy';
    if (flag) {
      await think.cache(cacheKey, null)
    }
    let ret = await think.cache(cacheKey)

    if (think.isEmpty(ret)) {
      const _data = await this.model('term_taxonomy', {appId: this.appId}).select();
      await think.cache(cacheKey, _data)
      ret = await think.cache(cacheKey)
    }
    return ret
  }

  /**
   * 根据内容获取分类，这里查询出来的分类未查询 它所归属的分类法，仅类别信息
   * @param objectId
   * @returns {Promise.<void>}
   */
  async getTermByObject (objectId) {
  }

  /**
   * 添加对象关联，支持多分类
   *
   * @param object_id
   * @param term_taxonomy_id
   * @returns {Promise.<void>}
   */
  async _relationships (object_id, term_taxonomy_id) {
    const _term_relationships = this.model('term_relationships', {appId: this.appId});

    await _term_relationships.thenUpdate({
      'object_id': object_id,
      'term_taxonomy_id': term_taxonomy_id
    }, {object_id: object_id, term_taxonomy_id: term_taxonomy_id})
  }

  /**
   * 添加对象关联，单分类
   *
   * @param object_id
   * @param term_taxonomy_id
   * @returns {Promise.<void>}
   */
  async relationships (object_id, term_taxonomy_id) {
    const _term_relationships = this.model('term_relationships', {appId: this.appId});
    const res = await _term_relationships.where({object_id: object_id, term_taxonomy_id: term_taxonomy_id}).find()
    // 不存在就添加
    // const res = await model.thenAdd({object_id: term_taxonomy_id}, {object_id: term_taxonomy_id})

    // 存在就删除
    // if (!think.isEmpty(res)) {
    //   await model.where({object_id: object_id, term_taxonomy_id: term_taxonomy_id}).delete();
    // }
    if (think.isEmpty(res)) {
      await _term_relationships.add({object_id: object_id, term_taxonomy_id: term_taxonomy_id})
    } else {
      await _term_relationships.where({object_id: object_id, term_taxonomy_id: term_taxonomy_id}).delete();
    }
  }

  /**
   * 按名字查询类别信息
   * @param taxonomy
   * @param term_slug
   * @returns {Promise<any>}
   */
  async findTermByName (taxonomy, term_name) {
    const data = await this.model('term_taxonomy', {appId: this.appId}).alias('tt').join({
      terms: {
        as: 't',
        on: ['tt.term_id', 't.id']
      }
    }).field([
      't.id as term',
      'tt.id as taxonomy',
      't.name',
      't.slug',
      'description',
      'count'
    ]).where({
      'tt.taxonomy': taxonomy,
      't.slug': term_name
    }).find()
    return data
  }

  /**
   * 根据 slug 查询所属分类方法的分类信息
   * @param taxonomy
   * @param term_slug
   * @returns {Promise.<void>}
   */
  async findTermBySlug (taxonomy, term_slug) {
    const data = await this.model('term_taxonomy', {appId: this.appId}).alias('tt')
      .join({
        terms: {
          as: 't',
          on: ['tt.term_id', 't.id']
        }
      }).field([
        't.id as term_id',
        'tt.id as term_taxonomy_id',
        't.name',
        't.slug',
        'description',
        'count'
      ]).where({
        'tt.taxonomy': taxonomy,
        't.slug': term_slug
      }).find()
    return data

  }
  /**
   * 根据 slug 查询所属分类方法的分类信息
   * @param taxonomy
   * @param term_slug
   * @returns {Promise.<void>}
   */
  async findTermById (taxonomy, id) {
    const data = await this.model('term_taxonomy', {appId: this.appId}).alias('tt')
      .join({
        terms: {
          as: 't',
          on: ['tt.term_id', 't.id']
        }
      }).field([
        't.id as term_id',
        'tt.id as term_taxonomy_id',
        't.name',
        't.slug',
        'description',
        'count'
      ]).where({
        'tt.taxonomy': taxonomy,
        't.id': id
      }).find()
    return data

  }

  /**
   * @deprecated
   * @param slug
   * @returns {Promise.<*>}
   */
  async getTermBySlug (slug) {
    const terms = await this.allTerms()
    const term = await think._.find(terms, ['slug', slug.toString()])
    if (!think.isEmpty(term)) {
      return term
    }
    return []
  }

  async is_taxonomy_hierarchical (termId) {
    const hierarchical = await this.model('term_taxonomy', {appId: this.appId}).where({
      parent: termId
    }).select()

    return hierarchical.length > 0
  }

  /**
   * 删除标签
   * @param term_id
   * @param term_taxonomy_id
   * @returns {Promise.<void>}
   */
  async deleteTag (term_id, term_taxonomy_id) {
    const _termmeta = this.model('termmeta', {appId: this.appId});
    const _terms = this.model('terms', {appId: this.appId});
    const _taxonomy = this.model('term_taxonomy', {appId: this.appId});
    const _term_relationships = this.model('term_relationships', {appId: this.appId});

    try {
      await _termmeta.where({
        term_id: term_id
      }).delete()

      // 更新内容关联
      await _term_relationships.where({
        term_taxonomy_id: term_taxonomy_id
      }).delete()

      // 删除分类方法
      await _taxonomy.where({
        id: term_taxonomy_id
      }).delete()

      // 删除分类
      await _terms.where({
        id: term_id
      }).delete()
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  // async deleteTag (term, taxonomy)
  /**
   * 删除 Term
   *
   * @param term_id
   * @param taxonomy_id
   * @returns {Promise.<boolean>}
   */
  async deleteTerm (term_id, taxonomy_id) {
    const options = await this.model('options', {appId: this.appId}).get()
    const defaultTerm = options.default.term
    if (defaultTerm === term_id) {
      return false
    }
    // let id = this.get('id');
    // 1 删除 分类前，先做更新内容操作，将与分类关联的内容更新
    // await preDeleteTerm();
    // 2 删除分类的 meta 数据
    const _termmeta = this.model('termmeta', {appId: this.appId});
    const _terms = this.model('terms', {appId: this.appId});
    const _taxonomy = this.model('term_taxonomy', {appId: this.appId});
    const _term_relationships = this.model('term_relationships', {appId: this.appId});

    try {
      await _termmeta.where({
        term_id: term_id
      }).delete()

      // 更新内容关联
      await _term_relationships.where({
        term_taxonomy_id: taxonomy_id
      }).update({
        term_taxonomy_id: defaultTerm
      })

      // 删除分类方法
      await _taxonomy.where({
        id: taxonomy_id
      }).delete()

      // 删除分类
      await _terms.where({
        id: term_id
      }).delete()
    } catch (e) {
      console.log(e)
      throw e
    }
    // 3 删除 分类的类别方法数据
    // 4 解除与类别关联的内容关系
  }

  async getMenuById (menuId) {
    let menus = await this.findTermById('nav_menu', menuId)
    const items = await this.getNavMenuItems(menus.term_id)
    menus.items = items
    return menus
  }
  /**
   * 获取全部菜单
   * @returns {Promise<Array>}
   */
  async getAllMenu () {
    const all_terms = await this.allTerms(true);
    const taxonomies = await this.allTaxonomies(true);
    const nav_menus = think._.filter(taxonomies, {taxonomy: 'nav_menu'});
    // console.log(JSON.stringify(all_terms))

    const _terms = [];
    nav_menus.forEach((item) => {
      _terms.push(think._.filter(all_terms, {term_id: item.term_id}))
    })
    return think._.flattenDeep(_terms);
  }

  /**
   * 获取分类下的所有内容
   *
   * @param term_ids
   * @param taxonomies
   * @returns {Promise.<void>}
   */
  async getObjectsInTerm (term_ids, taxonomies, page) {


    // let ret = await think.cache("_objects_in_term", async() => {
    // 遍例 taxonomy 查询是否存在
    let _term_relationships = this.model("term_relationships");
    let objects;

    if (!page || page === null) {
      // console.log('page is null')
      objects = await _term_relationships.join({
        table: "term_taxonomy",
        join: "inner",
        as: "tt",
        on: ["term_taxonomy_id", "term_id"]

      }).field("object_id").where("tt.taxonomy IN ('" + taxonomies + "') AND tt.term_id IN (" + term_ids + ")").select();
      let ids = [];
      for (let obj of objects) {
        ids.push(obj.object_id);
      }
      return ids;
    }

    objects = await _term_relationships.join({
      table: "term_taxonomy",
      join: "inner",
      as: "tt",
      on: ["term_taxonomy_id", "term_id"]

    }).field("object_id").where("tt.taxonomy IN ('" + taxonomies + "') AND tt.term_id IN (" + term_ids + ")").order('object_id DESC').page(page, 10).countSelect();

    let ids = [];
    for (let obj of objects.data) {
      ids.push(obj.object_id);
    }
// eslint-disable-next-line prefer-reflect
    delete objects.data;
    objects.ids = ids;

    return objects;

    // }, this.cacheOptions);

    // return objects;
    // return ret;
  }


  /**
   * 获取菜单项信息
   * @param menu_id
   * @returns {Promise<Array>}
   */
  async getNavMenuItems (menu_id) {

    const _taxonomy = this.model('taxonomy', {appId: this.appId});

    const item_ids = await _taxonomy.getAllObjectsInTerms(menu_id, 'nav_menu');

    const posts = this.model('posts');

    const navitems = [];

    const itemType = {
      taxonomy: "taxonomy",
      post_type: "post_type"
    };

    const objectType = {
      page: "page",
      custom: "custom"
    };

    if (think.isEmpty(item_ids)) {
      return []
    }
    let nav_items = await posts.getNavItems(item_ids);
    // _formatOneMeta(item)
    // _formatMeta(nav_items)
    // console.log(JSON.stringify(nav_items))
    for (const item of nav_items) {
      // console.log(JSON.stringify(item.meta._menu_item) + '-------')
      if (!think.isEmpty(item.meta._menu_item)) {
        item.path = '';
        const _meta = item.meta;
        if (think.isEmpty(_meta._menu_item)) {
          return
        }
        // if (think.isEmpty(_meta._menu_item_type)) {
        //   return
        // }
        switch (_meta._menu_item.type) {
          case itemType.taxonomy: {
            //
            item.path = _meta._menu_item.object + "/" + _meta._menu_item.object_id;
            break;
          }
          case itemType.post_type: {
            if (_meta._menu_item.object === objectType.page) {
              item.path = !think.isEmpty(_meta._menu_item.url) ? _meta._menu_item.url : (_meta._menu_item.object + "/" + _meta._menu_item.object_id)
            }
            break;
          }
          default: {
            item.path = _meta._menu_item.url;
            break;
          }
        }

      }

      // }
      navitems.push(item)
    }

    return navitems;
  }

}
