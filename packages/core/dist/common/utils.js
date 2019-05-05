"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
function not(predicate) {
    return (...args) => !predicate(...args);
}
exports.not = not;
function foundIn(set, compareBy) {
    return (item) => set.some(t => t[compareBy] === item[compareBy]);
}
exports.foundIn = foundIn;
function assertFound(promise) {
    return promise;
}
exports.assertFound = assertFound;
function normalizeEmailAddress(input) {
    return input.trim().toLowerCase();
}
exports.normalizeEmailAddress = normalizeEmailAddress;
function formatAllMeta(list, config) {
    const items = [];
    for (const item of (config && config.filterKey ? _.map(list, config.filterKey) : list)) {
        item.meta = {};
        if (_.has(item, 'metas') && item.metas.length > 0) {
            _formatMeta(item, config && config.cleanMeta);
        }
        items.push(item);
    }
    return items;
}
exports.formatAllMeta = formatAllMeta;
function formatOneMeta(item, config) {
    item = config && config.filterKey ? _.get(item, config.filterKey) : item;
    item.meta = {};
    if (_.has(item, 'metas') && item.metas.length > 0) {
        _formatMeta(item, config && config.cleanMeta);
    }
    return item;
}
exports.formatOneMeta = formatOneMeta;
function _formatMeta(item, clean) {
    for (const meta of item.metas) {
        if (meta.key.includes('_capabilities')) {
            item = Object.assign(item, meta.value);
        }
        if (meta.key.includes('_wechat')) {
            const wechat = meta.value;
            item = Object.assign(item, {
                avatarUrl: wechat.avatarUrl,
            });
        }
        if (meta.key.includes('_liked_posts')) {
            item.liked = meta.value;
        }
        item.meta[meta.key] = meta.value;
    }
    Reflect.deleteProperty(item, 'metas');
    clean && Reflect.deleteProperty(item, 'meta');
}
//# sourceMappingURL=utils.js.map