/* eslint-disable no-return-await */
const Base = require('./base');

module.exports = class extends Base {
  /**
   * Check whether a category exists.
   *
   * @param int|string    cate_name   Category name.
   * @param int           parent      Optional. ID of parent term.
   * @returns {Promise.<void>}
   */
  async categoryExists (cate_name, parent = null) {

  }


  /**
   * Check if Term exists.
   *
   * @param int|string term The term to check. Accepts term ID, slug, or name.
   * @param string taxonomy The taxonomy name to use
   * @param int parent Optional. ID of parent term under which to confine the exists search.
   * @returns {Promise.<void>}
   */
  async termExists (term, taxonomy = '', parent = null) {
    let _terms = this.model("terms");
    // let _taxonomy = this.model("term_taxonomy");

    if (think.isNumber(term)) {
      if (0 === term) {
        return term;
      }

      let map = {};
      map['t.term_id'] = term;

      if (!think.isEmpty(taxonomy)) {
        map['tt.taxonomy'] = taxonomy;

        return await _terms.alias("t").field("tt.term_id, tt.term_taxonomy_id").join({
          table: "term_taxonomy",
          join: "inner",
          as: "tt",
          on: ["term_id", "term_id"]

        }).where(map).select();
      }

      return await _terms.alias("t").field("term_id").where(map).select();
    }


    if (!think.isEmpty(taxonomy)) {

    }
    let map = {};
    map['t.slug'] = taxonomy;
    // map['tt.taxonomy'] =
    let result = await _terms.field("tt.term_id, tt.term_taxonomy_id").join({
      table: "term_taxonomy",
      join: "inner",
      as: "tt",
      on: ["term_id", "term_id"]
    }).order('t.term_id ASC').where().select();

  }


  async getTerms (taxonomy) {
    let where = {};
    // query.taxonomy
    where['tt.taxonomy'] = taxonomy;
    let _terms = this.model("terms");

    let result = await _terms.join({
      table: "term_taxonomy",
      join: "inner",
      as: "tt",
      on: ["term_id", "term_id"]
    }).where(where).select();

    return result;
  }

}
