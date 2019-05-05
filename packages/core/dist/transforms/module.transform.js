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
exports.packageJson = require(path.join(__dirname, '..', '..') + '/package.json');
exports.default = {
    packageJson: exports.packageJson,
};
//# sourceMappingURL=module.transform.js.map