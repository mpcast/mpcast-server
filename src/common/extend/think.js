const lodash = require("lodash");
const path = require('path');
const shortId = require('shortid')
const tc = require('./textcensor')

module.exports = {
  _: lodash,
  tc: tc,
  id: shortId,
  resource: path.join(think.ROOT_PATH, 'www')
}
