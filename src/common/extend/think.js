const lodash = require("lodash");
const path = require('path');
const shortId = require('shortid')
const tc = require('./textcensor')
const qetag = require('./qetag')

module.exports = {
  _: lodash,
  tc: tc,
  id: shortId,
  etag: qetag,
  resource: path.join(think.ROOT_PATH, 'www')
}
