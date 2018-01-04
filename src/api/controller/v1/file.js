/* eslint-disable no-undef,prefer-reflect */
const path = require('path');
const fs = require('fs')
// const sharp = require('sharp')
const mediaTags = require("jsmediatags")
// const BaseRest = require('./_rest')
module.exports = class extends think.Controller {

  async postAction () {
    const postModel = this.model('posts')
    const optionsModel = this.model('options')
    // 获取 当前用户配置
    const option = await optionsModel.get(true)
    let config = option.upload

    // Basil @170831 获取 用户自定义上传服务（现仅支持七牛）
    if (!Object.is(option.upload, undefined)) {
      config = option.upload
    }
    const httpx = config.option.ssl ? 'https' : 'http'

    // 获取 文件信息
    const file = think.extend({}, this.file('file'))
    const filePath = file.path
    const extname = path.extname(file.name)
    const basename = path.basename(filePath) + extname;


    // if (oneOf(file.type, ['audio/mpeg', 'audio/mp3'])) {
    //   return this.success(file.originalFilename)
    // }
    // 执行文件上传逻辑
    if (config.type === 'qiniu') {
      const service = this.service('qiniu')
      const upload = await service.upload(filePath, basename, config.option)
      // console.log(this.ctx.state)
      if (!think.isEmpty(upload)) {
        const data = {
          // 验证权限 后获取
          author: this.ctx.state.user.userInfo.id,
          title: file.name.split('.')[0],
          name: upload.hash,
          // path: '/upload/picture/' + dateformat(new Date().getTime(), "Y-m-d") + '/' + basename,
          type: 'attachment',
          mime_type: file.type,
          guid: `${httpx}://${config.option.domain}/${upload.key}`,
          create_time: new Date().getTime(),
          status: 'publish',
        }
        const fileUrl = `${httpx}://${config.option.domain}/${upload.key}`
        const _post_id = await postModel.add(data);

        const retData = {
          id: _post_id,
          url: fileUrl,
          title: data.title
        }
        if (oneOf(file.type, ['image/jpg', 'image/jpeg', 'image/png'])) {
          try {
            // await this.sharpMetadata(file.path)
            await postModel.addMeta(_post_id, '_attachment_file', fileUrl)
            return this.success(retData)
          } catch (e) {
            console.error(e)
            return this.fail()
// eslint-disable-next-line no-unreachable
          }
        }
      }
      return this.success(retData)
    }

  }


  /**
   * 文件上传
   * @returns {Promise.<*>}
   */
  async uploadAction () {
    const _postModel = this.model('posts', {orgId: this.orgId})

    const file = think.extend({}, this.file('file'));

    // console.log(JSON.stringify(file))
    // console.log(this.options)
    const filepath = file.path;
    const basename = path.basename(filepath);

    const ret = {'status': 1, 'info': '上传成功', 'data': ""}
    let res;


    // 加入七牛接口
    if (this.options.upload.type === "qiniu") {

      const qiniu = think.service("qiniu");
// eslint-disable-next-line new-cap
      const instance = new qiniu();
      const uppic = await instance.upload(filepath, basename, this.aid);

      if (!think.isEmpty(uppic)) {

        const data = {
          author: this.ctx.state.user.id,
          title: file.originalFilename,
          name: uppic.hash,
          // path: '/upload/picture/' + dateformat(new Date().getTime(), "Y-m-d") + '/' + basename,
          type: 'attachment',
          mime_type: file.headers['content-type'],
          guid: "http://" + this.options.upload.option.domain + "/" + uppic.key,
          create_time: new Date().getTime(),
          status: 1,

        };
        // const _attachment_metadata = '';
        // const _attachment_metadata = await this.sharpMetadata(file.path)
        const _post_id = await _postModel.add(data);

        if (!think.isEmpty(_post_id)) {
          // await _postModel.addPostMeta(_post_id, "_attachment_metadata", _attachment_metadata);
          await _postModel.addPostMeta(_post_id, "_attachment_file", uppic.key);
        }

        ret.data = data;

      }


    } else {
      const uploadPath = think.RESOURCE_PATH + '/upload/picture/' + dateformat(new Date().getTime(), "Y-m-d");

      think.mkdir(uploadPath);

      if (think.isFile(filepath)) {
        fs.renameSync(filepath, uploadPath + '/' + basename);

      } else {
        console.log("文件不存在！")

      }
      file.path = uploadPath + '/' + basename;


      if (think.isFile(file.path)) {
        const _path = '/upload/picture/' + dateformat(new Date().getTime(), "Y-m-d") + '/' + basename;

        const data = {
          author: this.userInfo.id,
          title: file.originalFilename,
          name: basename,
          // path: '/upload/picture/' + dateformat(new Date().getTime(), "Y-m-d") + '/' + basename,
          type: 'attachment',
          mime_type: file.headers['content-type'],
          guid: this.options.site_url + _path,
          create_time: new Date().getTime(),
          status: 1,

        }
        // const _attachment_metadata = await sharp(file.path).metadata();
        // delete _attachment_metadata.exif;

        const _post_id = await _dao.add(data);
        // this.dao.addPostMeta(_post_id, "_attachment_metadata", _attachment_metadata);
        await _dao.addPostMeta(_post_id, "_attachment_file", _path);


        ret.data = data;
      } else {
        console.log('not exist')
      }
    }
    return this.json(ret);
  }

  // 用 sharp 处理图片信息
  async sharpMetadata (filepath) {
    // const metadata = await sharp(filepath).metadata();
    // Reflect.deleteProperty(metadata, 'exif')
    // delete metadata.exif;
    // return metadata
  }
}
