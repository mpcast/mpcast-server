const lodash = require("lodash");
const path = require('path');
const shortId = require('shortid')
const tc = require('./textcensor')
const qetag = require('./qetag')
const Redis = require('ioredis')
const isDev = think.env === 'development'

module.exports = {
  _: lodash,
  redis: new Redis({
    port: isDev ? 6379 : 6377,
    host: isDev ? '127.0.0.1' : '114.55.230.6',
    password: isDev ? '' : '__@caixie-redis_v2'
  }),
  tc: tc,
  id: shortId,
  etag: qetag,
  resource: path.join(think.ROOT_PATH, 'www')
}
