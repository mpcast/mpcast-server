"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./interfaces/http.interface"));
__export(require("./interfaces/state.interface"));
var EUserPostsBehavior;
(function (EUserPostsBehavior) {
    EUserPostsBehavior["VIEW"] = "_post_views";
    EUserPostsBehavior["THUMB"] = "_thumbs";
    EUserPostsBehavior["LIKE"] = "_liked";
})(EUserPostsBehavior = exports.EUserPostsBehavior || (exports.EUserPostsBehavior = {}));
var EBlockFormatType;
(function (EBlockFormatType) {
    EBlockFormatType["ALBUM"] = "block-format-album";
    EBlockFormatType["GALLERY"] = "block-format-gallery";
    EBlockFormatType["AUDIO"] = "block-format-audio";
    EBlockFormatType["QUOTE"] = "block-format-quote";
    EBlockFormatType["CODE"] = "block-format-code";
    EBlockFormatType["DOC"] = "block-format-DOC";
})(EBlockFormatType = exports.EBlockFormatType || (exports.EBlockFormatType = {}));
//# sourceMappingURL=common-types.js.map