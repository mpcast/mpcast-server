const fs  = require('fs');
module.exports = class extends think.Service {
  /**
   * init
   *  @param {Array}  file   [备份或还原的文件信息]
   *  @param {Array}  config [备份配置信息]
   *  @param {String} type   [执行类型，export - 备份数据， import - 还原数据]
   * @return {[]}         []
   */
  constructor(config) {
    super()
    this.config = config
  }
  // constructor(file, config, type, ctx) {
  //   super(ctx);
  //   this.file = file;
  //   this.config = config;
  //   this.type = type;
  //   this.ctx = ctx;
  // }

  async create() {
    const db = think.model('mysql', think.config('model'));
    const dbConfig = think.config('model.mysql');
    // let model = this.getModel(true);
    // let dbExist = await model.query("SELECT `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA`='" + this.dbConfig.database + "'");
    // if (think.isEmpty(dbExist)) {
    //     //忽略错误
    //     await model.query('CREATE DATABASE `' + this.dbConfig.database + '`').catch(() => {
    //     });
    //     //model.close();
    // }
    // this.config.path
    const dbFile = think.ROOT_PATH + '/picker.sql';
    if (!think.isFile(dbFile)) {
      return Promise.reject('数据库文件（picker.sql）不存在，请重新下载');
    }


    let content = fs.readFileSync(dbFile, 'utf8');
    content = content.split('\n').filter(item => {
      item = item.trim();
      const ignoreList = ['#', 'LOCK', 'UNLOCK'];
      for (const it of ignoreList) {
        if (item.indexOf(it) === 0) {
          return false;
        }
      }
      return true;
    }).join(' ');
    content = content.replace(/\/\*.*?\*\//g, '').replace(/picker_/g, dbConfig.prefix + this.config.orgId + '_' || '');
    // console.log(JSON.stringify(content))
    //
    //
    // 导入数据
    // model = this.getModel();
    content = content.split(';');
    // console.log(JSON.stringify(content))

    // await model.query()
    try {
      for (let item of content) {

        item = item.trim();
        if (item) {
          console.log(item);
          await db.query(item);
        }
      }
      // await model.query(INSERT INTO picker.picker_users (user_login, user_pass, user_nicename, user_email, user_url, user_registered, user_activation_key, user_status, display_name, spam, deleted) VALUES ('baisheng', '$2a$08$8Nces8qHueK2COiQHxg/2.nbjfEesbZdUHV033wkIsmgP6pVLsONu', null, null, null, 1491660103631, 'SklIav8px', 0, null, 0, 0);

    } catch (e) {
      console.error(e);
      return Promise.reject('数据表导入失败。');
    }

  }
}

