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
    // host: '127.0.0.1',
    host: isDev ? '127.0.0.1' : '114.55.230.6',
    password: isDev ? '' : '__2017@picker-redis'
  }
}
