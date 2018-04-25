/* eslint-disable no-undef */
require('./global');
// const Redis = require('../extend/redis')
// const isDev = think.env === 'development'

// const cxRedis = new Redis({
//   port: isDev ? 6379 : 6377,
//   host: isDev ? '127.0.0.1' : '114.55.230.6',
//   password: isDev ? '' : '__@caixie-redis_v2'
// })
// invoked in worker
think.beforeStartServer(async () => {
  // 获取全部组织账户信息并缓存
  const orgs = await think.model('orgs').list()
  await think.cache('orgs', orgs)
  // 获取全部应用列表并缓存
  const apps = await think.model('apps').list()
  await think.cache('apps', apps)

  let hashApp = {}
  for(let app of apps) {
    hashApp[`${app.id}`] = JSON.stringify(app)
  }
  await think.redis.hmset('cx:app:list', hashApp)
  // const ya = await think.redis.hget('cx:app:list', 'ry6F11G8z')

  const options = await think.model('options').get(true)
  think.config('options', options)
})

think.app.on("appReady", function () {
})
