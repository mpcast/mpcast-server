const redisCache = require('think-cache-redis');
const isDev = think.env === 'development'

module.exports = {
  type: 'redis',
  common: {
    timeout: 72 * 3600 * 1000 // millisecond
  },
  redis: {
    handle: redisCache,
    port: 6379,
    host: 'redis',
    password: ''
    // port: isDev ? 6379 : 6379,
    // host: isDev ? '127.0.0.1' : 'redis',
    // password: isDev ? '' : '__@caixie-redis_v2'
  }
}
