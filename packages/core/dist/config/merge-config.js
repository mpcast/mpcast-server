"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
function isClassInstance(item) {
    return isObject(item) && item.constructor.name !== 'Object';
}
function mergeConfig(target, source) {
    if (!source) {
        return target;
    }
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                if (!isClassInstance(source[key])) {
                    mergeConfig(target[key], source[key]);
                }
                else {
                    target[key] = source[key];
                }
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return target;
}
exports.mergeConfig = mergeConfig;
//# sourceMappingURL=merge-config.js.map