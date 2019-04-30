// 定义与规范用 type，数据传递用 Interface
export * from './interfaces/http.interface';
export * from './interfaces/state.interface';

export enum EUserPostsBehavior {
  VIEW = '_post_views', // 内容浏览量
  THUMB = '_thumbs', // 点赞
  LIKE = '_liked', // 喜欢
}

export enum EBlockFormatType {
  ALBUM = 'block-format-album',
  GALLERY = 'block-format-gallery',
  AUDIO = 'block-format-audio',
  QUOTE = 'block-format-quote',
  CODE = 'block-format-code',
  DOC = 'block-format-DOC',
}

export interface ITokenResult {
  token: string;
  expiresIn: number;
}

/**
 * 根据 T 范型创建类型, 所有属性都是不可选和只读。
 */
export type ReadOnlyRequired<T> = { +readonly [K in keyof T]-?: T[K] };
