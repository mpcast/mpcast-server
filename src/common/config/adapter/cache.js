const redisCache = require('think-cache-redis');
const isDev = think.env === 'development'

module.exports = {
  type: 'redis',
  common: {
    timeout: 72 * 3600 * 1000 // millisecond
  },
  redis: {
    handle: redisCache,
    port: isDev ? 6379 : 6377,
    host: isDev ? '127.0.0.1' : '114.55.230.6',
    password: isDev ? '' : '__@caixie-redis_v2'
  }
}
