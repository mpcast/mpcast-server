/**
 * model adapter config
 * @type {Object}
 */
const mysql = require('think-model-mysql')
const isDev = think.env === 'development'

// let msc = {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_DATABASE,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   prefix: process.env.DB_PREFIX,
//   encoding: process.env.DB_ENCODING
// }
//
// try {
//   const dbConfig = require('../db.js')
//   msc = (dbConfig.default ? dbConfig.default : dbConfig).adapter.mysql
// } catch (e) {
//   //eslint-disable-line
// }
module.exports = {
  type: process.env.DB_MODE || 'mysql',
  common: {
    charset: 'UTF8MB4',
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  // mysql: {
  //   handle: mysql,
  //   dateStrings: true,
  //   host: msc.host,
  //   port: msc.port,
  //   database: msc.database,
  //   user: msc.user,
  //   password: msc.password,
  //   prefix: msc.prefix,
  //   encoding: msc.encoding
  // },
  mysql: {
    logConnect: isDev,
    handle: mysql,
    database: 'picker',
    prefix: 'picker_',
    charset: 'UTF8MB4_GENERAL_CI',
    host: isDev ? '127.0.0.1' : '114.55.230.6',
    port: isDev ? '3399' : '3377',
    user: 'root',
    password: 'ub08JASJQy9s',
    dateStrings: true
  }
}
