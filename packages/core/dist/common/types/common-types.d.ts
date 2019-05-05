export * from './interfaces/http.interface';
export * from './interfaces/state.interface';
export declare enum EUserPostsBehavior {
    VIEW = "_post_views",
    THUMB = "_thumbs",
    LIKE = "_liked"
}
export declare enum EBlockFormatType {
    ALBUM = "block-format-album",
    GALLERY = "block-format-gallery",
    AUDIO = "block-format-audio",
    QUOTE = "block-format-quote",
    CODE = "block-format-code",
    DOC = "block-format-DOC"
}
export interface ITokenResult {
    token: string;
    expiresIn: number;
}
export declare type ReadOnlyRequired<T> = {
    +readonly [K in keyof T]-?: T[K];
};
