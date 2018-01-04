module.exports = class extends think.Logic {
  __before() {
    console.log(('Logic Base__before....'))
  }

  indexAction() {
    this.allowMethods = 'get'
    console.log(('Logic __before....'))
  }
  __after() {
  }
}
