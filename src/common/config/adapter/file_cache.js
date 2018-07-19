const path = require('path')
const fileCache = require('think-cache-file')

module.exports = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'),
    pathDepth: 2,
    gcInterval: 24 * 60 * 60 * 1000 // gc interval
  }
}
