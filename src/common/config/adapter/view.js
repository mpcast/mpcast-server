const nunjucks = require('think-view-nunjucks')
const path = require('path')
module.exports = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks,
    options: {
      tags: { // 修改定界符相关的参数
        // blockStart: '<%',
        // blockEnd: '%>',
        variableStart: '<$',
        variableEnd: '$>'
        // commentStart: '<#',
        // commentEnd: '#>'
      }
    },
    beforeRender: (env, nunjucks, config) => {
    }
  }
}
