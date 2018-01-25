/* eslint-disable prefer-reflect,no-undef */
// 生成6位的随机数
global.Random = () => {
  let num = ''
  for (let i = 0; i < 6; i++) {
    num += Math.floor(Math.random() * 10)
  }
  return num
}

/**
 * ip转数字
 * @param ip
 * @returns {number}
 * @private
 */
/* global _ip2int(ip)*/
global._ip2int = function (ip) {
  let num = 0;
  ip = ip.split(".");
  num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
  num >>>= 0;
  return num;
}
/**
 * 数字转ip
 * @param num
 * @returns {string|*}
 * @private
 */
/*global _int2ip(num: number) */
global._int2iP = function (num) {
  let str;
  const tt = new Array();
  tt[0] = (num >>> 24) >>> 0;
  tt[1] = ((num << 8) >>> 24) >>> 0;
  tt[2] = (num << 16) >>> 24;
  tt[3] = (num << 24) >>> 24;
  str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
  return str;
}

/**
 * 数组去重
 * @param arr
 * @returns {Array}
 */
/* global unique */
global.unique = function (arr) {
  // var result = [], hash = {};
  // for (var i = 0, elem; (elem = arr[i]) != null; i++) {
  //     if (!hash[elem]) {
  //         result.push(elem);
  //         hash[elem] = true;
  //     }
  // }
  // return result;
  return Array.from(new Set(arr));
}

/**
 * 把返回的数据集转换成Tree
 * @param array data 要转换的数据集
 * @param string pid parent标记字段
 * @return array
 */
/* global arr_to_tree */
global.arr_to_tree = function (data, parent) {
// eslint-disable-next-line one-var
  let result = [], temp;
  const length = data.length;
  if (length === 1) {
    data[0].children = []
    data[0].chnum = data[0].children.length
    return data
  }
  // console.log(JSON.stringify(data))
  // console.log(length + 'xxx----')
  for (let i = 0; i < length; i++) {

    if (data[i].parent === parent) {
      result.push(data[i]);
      temp = this.arr_to_tree(data, data[i].id);
      if (temp.length > 0) {
        data[i].expanded = true;
        data[i].children = temp;
        data[i].chnum = data[i].children.length
      }
    }
  }
  return result;
}

/* global arr_to_tree */
global.treeGroup = function (data, parent) {
  // eslint-disable-next-line one-var
  let result = [], temp;
  const length = data.length;
  if (length === 1) {
    data[0].children = []
    data[0].chnum = data[0].children.length
    return data
  }
  for (let i = 0; i < length; i++) {
    if (data[i].parent === parent) {
      result.push(data[i]);
      temp = this.arr_to_tree(data, data[i].id);
      if (temp.length > 0) {
        data[i].expanded = true;
        data[i].children = temp;
        data[i].chnum = data[i].children.length
      }
    }
  }
  return result;
}

// 判断参数是否是其中之一
global.oneOf = function (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}
global._formatOneMeta = (item) => {
  // const _items = [];

  // for (const item of list) {
  item.meta = {};
  if (!think.isEmpty(item.metas) && item.metas.length > 0) {
    for (const meta of item.metas) {
      if (meta.meta_key.includes('_liked_posts') && meta.meta_key.includes('picker_')) {
        item.liked = JSON.parse(meta.meta_value)
        // Object.assign(item, JSON.parse(meta.meta_value))
      }
      item.meta[meta.meta_key] = JSON.parse(meta.meta_value)
    }
  }
  Reflect.deleteProperty(item, 'metas')
  // _items.push(item);
  // }
  return item
}

// global._formatAndDealRoles = (item) => {
//
// }
global._formatMeta = (list) => {
  const _items = [];

  for (const item of list) {
    item.meta = {};
    if (!Object.is(item.metas, undefined) && item.metas.length > 0) {
      for (const meta of item.metas) {
        if (meta.meta_key.includes('_capabilities') && meta.meta_key.includes('picker_')) {
          Object.assign(item, JSON.parse(meta.meta_value))
        }
        if (meta.meta_key.includes('_wechat') && meta.meta_key.includes('picker_')) {
          const wechat = JSON.parse(meta.meta_value)
          // console.log(wechat.avatarUrl)
          Object.assign(item, {
            avatar: wechat.avatarUrl
          })
          // Object.assign(item, JSON.parse(meta.meta_value))
        }
        item.meta[meta.meta_key] = JSON.parse(meta.meta_value)
      }
    }
    Reflect.deleteProperty(item, 'metas')
    _items.push(item);
  }
  return _items
}

global._formatApps = (list) => {

}

global._formatOrgs = (orgs) => {
  for (const item of orgs) {
    // console.log(JSON.stringify(item) + '----')
  }
}

global.verifyMsgCode = async (identity, code, destory = false) => {
  // const Redis = require('ioredis')
  // const redis = new Redis()
  // const _code = await redis.get(identity)
  // if (!think.isEmpty(_code) && _code === code) {
  //   if (destory) {
  //     await redis.del(identity)
  //   }
  //   return true
  // }
  return false
}

global.getDate = () => {
  const date = new Date
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  month = (month < 10 ? "0" + month : month)
  const mydate = (year.toString() + '-' + month.toString())
  return mydate
}

global.getMonthFormatted = (m) => {
  const month = m + 1;
  return month < 10 ? '0' + month : '' + month; // 如果是1-9月，那么前面补0
}

/*!
 * 对提交参数一层封装，当POST JSON，并且结果也为JSON时使用 */
global.postJSON = (data) => {
  return {
    dataType: 'json',
    method: 'POST',
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
}

const JSONCtlCharsMap = {
  '"': '\\"',       // \u0022
  '\\': '\\',       // \u005c
  '\b': '\\b',      // \u0008
  '\f': '\\f',      // \u000c
  '\n': '\\n',      // \u000a
  '\r': '\\r',      // \u000d
  '\t': '\\t'       // \u0009
};
const JSONCtlCharsRE = /[\u0000-\u001F\u005C]/g;
const _replaceOneChar = (c) => {
  return JSONCtlCharsMap[c] || '\\u' + (c.charCodeAt(0) + 0x10000).toString(16).substr(1);
}

global.replaceJSONCtlChars = (str) => {
  return str.replace(JSONCtlCharsRE, _replaceOneChar);
}

global.objKeySort = (obj) => { // 排序的函数
  let newkey = Object.keys(obj).sort().reverse();
  // 先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  let newObj = {};// 创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < newkey.length; i++) { // 遍历newkey数组
    // console.log('-------- : ' + newkey[i])
    newObj[newkey[i]] = obj[newkey[i]];// 向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj;// 返回排好序的新对象
}
