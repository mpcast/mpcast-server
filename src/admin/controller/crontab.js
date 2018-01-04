module.exports = class extends think.Controller {
  async cloaAction() {
    const orgs = await think.model('orgs').list()
    await think.cache('orgs', orgs)
    // 获取全部应用列表并缓存
    const apps = await think.model('apps').list()
    await think.cache('apps', apps)
    const options = await think.model('options').get(true)
    // console.log(JSON.stringify(options.sms))
    think.config('options', options)
  }
};
