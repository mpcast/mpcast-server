import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Option, User } from '@app/entity';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from '@app/processors/cache/cache.service';
import * as CACHE_KEY from '@app/constants/cache.constant';
import * as _ from 'lodash';

@Injectable()
export class OptionService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(Option) private readonly optionRepository: Repository<Option>,
    private readonly cacheService: CacheService,
  ) {
  }

  /**
   * 从缓存中加载系统配置
   * @param flag 如果标识为 true 则更新缓存
   */
  async load(flag: boolean = false): Promise<any> {
    // 重置缓存
    if (flag) {
      await this.cacheService.set(CACHE_KEY.OPTIONS, null);
    }
    let cacheOptions = await this.cacheService.get(CACHE_KEY.OPTIONS);

    if (_.isEmpty(cacheOptions)) {
      const data = await this.optionRepository.find();
      const result = {};
      data.forEach(item => {
        result[item.key] = item.value;
      });
      await this.cacheService.set(CACHE_KEY.OPTIONS, result);
      cacheOptions = await this.cacheService.get(CACHE_KEY.OPTIONS);
    }
    return cacheOptions;
  }

  /**
   * 更新配置
   * @param optionKey
   * @param optionValue
   */
  async updateOptions(optionKey, optionValue) {
    const data = _.isObject(optionKey) ? _.extend({}, optionKey) : { [optionKey]: optionValue };
    let cacheOptions = await this.cacheService.get(CACHE_KEY.OPTIONS);
    if (_.isEmpty(cacheOptions)) {
      cacheOptions = await this.load();
    }

    const changedOptions = {};
    for (const tempKey in data) {
      if (data[tempKey] !== cacheOptions[tempKey]) {
        changedOptions[tempKey] = data[tempKey];
      }
    }
    const jsonSQL: any = `JSON_SET(value,'$.${optionValue.key}', '${optionValue.value}') WHERE \`key\` = '${optionKey}'`;

    // 如果数据没有变更
    if (_.isEmpty(changedOptions)) {
      return;
    }
    const updateResult = await this.connection
      .createQueryBuilder()
      .update(Option)
      .set({ value: jsonSQL })
      .where('key = :key', { key: optionKey })
      .execute();
    if (updateResult) {
      return await this.load(true);
    }
    return await this.load();
  }

  /**
   * 添加置顶配置数据项
   * @param key 置顶位置（EP. home、category and others）
   * @param itemId
   */
  async addSticky(key, itemId): Promise<any> {
    const options = await this.load();
    const stickys: {
      [key: string]: [number];
    } = options.stickys;
    for (const stickysKey in stickys) {
      if (stickysKey === key) {
        if (!stickys[key].includes(itemId)) {
          stickys[key].unshift(itemId);
          return await this.saveSticky(stickys);
        }
      }
    }
  }

  /**
   * 删除置顶数据项
   */
  async removeSticky(key, itemId) {
    const options = await this.load();
    const stickys: {
      [key: string]: [number];
    } = options.stickys;
    for (const stickysKey in stickys) {
      if (stickysKey === key) {
        if (stickys[key].includes(itemId)) {
          for (let i = 0; i < stickys[key].length; i++) {
            if (stickys[key][i] === itemId) {
              stickys[key].splice(i, 1);
            }
          }
        }
      }
    }
    await this.saveSticky(stickys);
  }

  /**
   * 保存置顶数据配置
   * @param stickys
   */
  async saveSticky(stickys) {
    const updateResult = await this.connection
      .createQueryBuilder()
      .update(Option)
      .set({ value: stickys })
      .where('key = :key', { key: 'stickys' })
      .execute();

    return updateResult;
  }

  /**
   * 获取网站配置
   * @returns {{}}
   */
  /*  async lists () {
      const map = {}
      map.status = 1;
      const list = await this.where(map).order("sort ASC").field(["name", "value", "type"]).select();
      const obj = {}
      list.forEach(v => {
        if (v.value.search(/\r\n/ig) > -1 && v.type != 2) {
          v.value = v.value.split("\r\n");
          const obj = {}
          v.value.forEach(n => {
            n = n.split(":");
            obj[n[0]] = n[1];
          })

          v.value = obj;
        }
        obj[v.name] = v.value;

      })
      return obj;
    }*/
}
