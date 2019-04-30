import * as path from 'path';
import {argv} from 'yargs';

import {environment} from './app.environment';
import { packageJson } from './transforms/module.transform';

export const APP = {
    LIMIT: 16,
    PORT: 5000,
    ROOT_PATH: __dirname,
    NAME: 'picker.cc',
    URL: 'https://picker.cc',
    ENVIRONMENT: environment,
    FRONT_END_PATH: path.join(__dirname, '..', '..', 'picker.cc'),
};
export const CROSS_DOMAIN = {
    allowedOrigins: ['https://picker.cc', 'https://cdn.picker.cc', 'https://data.picker.cc', 'https://admin.picker.cc'],
    allowedReferer: 'picker.cc',
};

export const REDIS = {
    host: argv.redis_host || 'localhost',
    port: argv.redis_port || 6379,
    ttl: null,
    defaultCacheTTL: 60 * 60 * 24,
};

export const AUTH = {
    expiresIn: argv.auth_expires_in || 3600,
    data: argv.auth_data || { user: 'root' },
    jwtTokenSecret: argv.auth_key || 'picker',
    defaultPassword: argv.auth_default_password || 'root',
};

export const ALIYUN = {
    ip: argv.aliyun_ip_auth,
};

export const QINIU = {
    accessKey: argv.qn_accessKey || 'your access key',
    secretKey: argv.qn_secretKey || 'your secret key',
    bucket: argv.qn_bucket || 'picker',
    origin: argv.qn_origin || 'http://picker.u.qiniudn.com',
    uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/',
};
export const INFO = {
    name: packageJson.name,
    version: packageJson.version,
    author: packageJson.author,
    site: APP.URL,
    github: 'https://github.com/caixie-ltd',
    homepage: packageJson.homepage,
    // issues: packageJson.bugs.url,
    powered: ['Vue', 'Nuxt.js', 'nestjs', 'ReactNative', 'Angular', 'Bootstrap', 'Nodejs', 'MongoDB', 'Express', 'Nginx'],
};
