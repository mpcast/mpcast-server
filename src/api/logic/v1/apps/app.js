module.exports = class extends think.Logic {
  __before() {
  }

  indexAction() {
    this.allowMethods = 'get'
  }
  __after() {
  }
}
