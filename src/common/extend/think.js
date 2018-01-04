const lodash = require("lodash");
const path = require('path');
const shortId = require('shortid')

module.exports = {
  _: lodash,
  id: shortId,
  resource: path.join(think.ROOT_PATH, 'www')
}
