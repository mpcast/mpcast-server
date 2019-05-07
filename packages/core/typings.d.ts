declare module 'wechat-jssdk' {

  // const EventEmitter = require('events');
    import * as EventEmitter from 'events';

    class Store extends EventEmitter {
    getGlobalToken(): Promise<object>;

    /**
     * Get signature for passed url from store
     * @param url
     * @return {Promise}
     */
    getSignature(url: string): Promise<object>;

    /**
     * Add signature to store for the new url
     * @param url
     * @param signatureInfo
     * @return {Promise}
     */
    saveSignature(url: string, signatureInfo: object): Promise<object>;

    /**
     * Update url signature to store
     * @param url
     * @param newInfo
     */
    updateSignature(url: string, newInfo: object): Promise<object>;

    isSignatureExisting(url: string): Promise<object>;

    saveOAuthAccessToken(key: string, info: object): Promise<object>;

    updateOAuthAccessToken(key: string, newInfo: object): Promise<object>;

    getCardTicket(): Promise<object>;

    updateCardTicket(ticketInfo: object): Promise<object>;

    getMPSessionKey(key: string): Promise<string>;

    getMPSession(key: string): Promise<object>;

    setMPSession(key: string, data: object): Promise<object>;

    flush();

    destory();

    clearStroe();
  }

    interface WechatOptions {
    appId?: string;
    appSecret?: string;
    store?: object;
    miniProgram?: {
      appId: string;
      appSecret: string;
    };
  }

    interface Code2SessionResponse {
    // openid	string	用户唯一标识
    // session_key	string	会话密钥
    // unionid	string	用户在开放平台的唯一标识符，在满足 UnionID 下发条件的情况下会返回，详见 UnionID 机制说明。
    // errcode	number	错误码
    // errmsg	string	错误信息
    openid: string;
    session_key: string;
    unionid?: string;
    errcode?: number;
    errmsg?: string;
  }
    class MiniProgram {
    constructor(options: WechatOptions);

    getSession(code: string, key?: string): Promise<Code2SessionResponse>;

    genSignature(rawDataString: string, sessionKey: string): Promise<object>;

    verifySignature(rawData: string | object, signature: string, sessionKey: string): Promise<object>;

    decryptData(encryptedData: string, iv: string, sessionKey: string, key?: string): Promise<object>;
  }

    class OAuth {
    /**
     * OAuth class
     * @constructor
     * @param {object=} options
     * @return {OAuth} OAuth instance
     */
    constructor(options: WechatOptions);

    /**
     * Get wechat user profile based on the access token
     * @param {object} tokenInfo access token info received based on the code(passed by the wechat server to the redirect_uri)
     * @param {boolean=} withToken if true, the access token info will be merged to the resolved user profile object
     * @return {Promise}
     */
    getUserInfoRemotely(tokenInfo: object, withToken: boolean): Promise<any>;

    /**
     * Set the expire time starting from now for the cached access token
     * @param {object} tokenInfo
     * @static
     * @return {object} tokenInfo updated token info
     */
    static setAccessTokenExpirationTime(tokenInfo: object): object;

    /**
     * Generate redirect url for use wechat oauth page
     * @param {string} redirectUrl
     * @param {string=} scope pass custom scope
     * @param {string=} state pass custom state
     * @return {string} generated oauth uri
     */
    generateOAuthUrl(redirectUrl: string, scope: string, state: string): string;

    /**
     * Get wechat user base info, aka, get openid and token
     * @param {*} code code included in the redirect url
     * @param {string} [key] key to store the oauth token
     * @return {Promise}
     */
    getUserBaseInfo(code: string, key: string): Promise<any>;

    /**
     * Get wechat user info, including nickname, openid, avatar, etc...
     * @param {*} code
     * @param {string} [key] key to store oauth token
     * @param {boolean} [withToken] return token info together with the profile
     * @return {Promise}
     */
    getUserInfo(code: string, key: string, withToken?: boolean): Promise<any>;

    /**
     * Get oauth access token
     * @param {*} code
     * @param {string} key custom user session id to identify cached token
     * @return {Promise}
     */
    getAccessToken(code: string, key: string): Promise<any>;
    /**
     * Get access token from wechat server
     * @param {*} code
     * @param {string} key
     * @return {Promise}
     */
    getAccessTokenRemotely(code: string, key: string): Promise<object>;

    /**
     * Refresh access token with the cached refresh_token over the wechat server
     * @param {string} key
     * @param {object} tokenInfo
     * @return {Promise}
     */
    refreshAccessToken(key: string, tokenInfo: object): Promise<any> | Error;

    /**
     * Check if cached token is valid over the wechat server
     * @param {object} tokenInfo
     * @return {Promise}
     */
    isAccessTokenValid(tokenInfo: object): Promise<any>;
    /**
     * Set default wechat oauth url for the instance
     */
    setDefaultOAuthUrl(): void;

    /**
     * Check if cached token is expired
     * @param {object} tokenInfo
     * @return {boolean}
     */
    static isAccessTokenExpired(tokenInfo: object): boolean;
  }

    class Wechat {
    public miniProgram: MiniProgram;
    public oauth: OAuth;
    constructor(options: WechatOptions);
  }

    class Card {

  }
}
