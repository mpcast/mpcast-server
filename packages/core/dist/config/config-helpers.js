"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_config_1 = require("./default-config");
const merge_config_1 = require("./merge-config");
let activeConfig = default_config_1.defaultConfig;
function setConfig(userConfig) {
    activeConfig = merge_config_1.mergeConfig(activeConfig, userConfig);
}
exports.setConfig = setConfig;
function getConfig() {
    return activeConfig;
}
exports.getConfig = getConfig;
//# sourceMappingURL=config-helpers.js.map