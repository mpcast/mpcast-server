module.exports = class extends think.Logic {
  __before() {
    console.log(('Logic __before....'))
  }

  indexAction() {
    console.log(('Logic __before....'))
  }
  __after() {
  }
}
