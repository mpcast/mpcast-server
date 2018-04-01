/**
 * model adapter config
 * @type {Object}
 */
const mysql = require('think-model-mysql')
const isDev = think.env === 'development'

module.exports = {
  type: 'mysql',
  common: {
    charset: 'UTF8MB4',
    logConnect: false,
    logSql: true,
    // logSql: false,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    logConnect: isDev,
    handle: mysql,
    database: 'picker',
    prefix: 'picker_',
    // charset: 'UTF8MB4',
    charset: 'UTF8MB4_GENERAL_CI',
    // debug: true,
    host: isDev ? '127.0.0.1' : '114.55.230.6',
    port: isDev ? '3399' : '3399',
    user: 'root',
    password: 'ub08JASJQy9s',
    dateStrings: true
  }
}
