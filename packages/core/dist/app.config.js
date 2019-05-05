"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const yargs_1 = require("yargs");
const app_environment_1 = require("./app.environment");
const module_transform_1 = require("./transforms/module.transform");
exports.APP = {
    LIMIT: 16,
    PORT: 5000,
    ROOT_PATH: __dirname,
    NAME: 'picker.cc',
    URL: 'https://picker.cc',
    ENVIRONMENT: app_environment_1.environment,
    FRONT_END_PATH: path.join(__dirname, '..', '..', 'picker.cc'),
};
exports.CROSS_DOMAIN = {
    allowedOrigins: ['https://picker.cc', 'https://cdn.picker.cc', 'https://data.picker.cc', 'https://admin.picker.cc'],
    allowedReferer: 'picker.cc',
};
exports.REDIS = {
    host: yargs_1.argv.redis_host || 'localhost',
    port: yargs_1.argv.redis_port || 6379,
    ttl: null,
    defaultCacheTTL: 60 * 60 * 24,
};
exports.AUTH = {
    expiresIn: yargs_1.argv.auth_expires_in || 3600,
    data: yargs_1.argv.auth_data || { user: 'root' },
    jwtTokenSecret: yargs_1.argv.auth_key || 'picker',
    defaultPassword: yargs_1.argv.auth_default_password || 'root',
};
exports.ALIYUN = {
    ip: yargs_1.argv.aliyun_ip_auth,
};
exports.QINIU = {
    accessKey: yargs_1.argv.qn_accessKey || 'your access key',
    secretKey: yargs_1.argv.qn_secretKey || 'your secret key',
    bucket: yargs_1.argv.qn_bucket || 'picker',
    origin: yargs_1.argv.qn_origin || 'http://picker.u.qiniudn.com',
    uploadURL: yargs_1.argv.qn_uploadURL || 'http://up.qiniu.com/',
};
exports.INFO = {
    name: module_transform_1.packageJson.name,
    version: module_transform_1.packageJson.version,
    author: module_transform_1.packageJson.author,
    site: exports.APP.URL,
    github: 'https://github.com/caixie-ltd',
    homepage: module_transform_1.packageJson.homepage,
    powered: ['Vue', 'Nuxt.js', 'nestjs', 'ReactNative', 'Angular', 'Bootstrap', 'Nodejs', 'MongoDB', 'Express', 'Nginx'],
};
//# sourceMappingURL=app.config.js.map