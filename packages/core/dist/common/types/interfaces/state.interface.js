"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EPublishState;
(function (EPublishState) {
    EPublishState[EPublishState["Draft"] = 0] = "Draft";
    EPublishState[EPublishState["Published"] = 1] = "Published";
    EPublishState[EPublishState["Recycle"] = -1] = "Recycle";
})(EPublishState = exports.EPublishState || (exports.EPublishState = {}));
var EPublicState;
(function (EPublicState) {
    EPublicState[EPublicState["Password"] = 0] = "Password";
    EPublicState[EPublicState["Public"] = 1] = "Public";
    EPublicState[EPublicState["Secret"] = -1] = "Secret";
})(EPublicState = exports.EPublicState || (exports.EPublicState = {}));
var EOriginState;
(function (EOriginState) {
    EOriginState[EOriginState["Original"] = 0] = "Original";
    EOriginState[EOriginState["Reprint"] = 1] = "Reprint";
    EOriginState[EOriginState["Hybrid"] = 2] = "Hybrid";
})(EOriginState = exports.EOriginState || (exports.EOriginState = {}));
var ECommentState;
(function (ECommentState) {
    ECommentState[ECommentState["Auditing"] = 0] = "Auditing";
    ECommentState[ECommentState["Published"] = 1] = "Published";
    ECommentState[ECommentState["Deleted"] = -1] = "Deleted";
    ECommentState[ECommentState["Spam"] = -2] = "Spam";
})(ECommentState = exports.ECommentState || (exports.ECommentState = {}));
var ECommentPostType;
(function (ECommentPostType) {
    ECommentPostType[ECommentPostType["Guestbook"] = 0] = "Guestbook";
})(ECommentPostType = exports.ECommentPostType || (exports.ECommentPostType = {}));
var ECommentParentType;
(function (ECommentParentType) {
    ECommentParentType[ECommentParentType["Self"] = 0] = "Self";
})(ECommentParentType = exports.ECommentParentType || (exports.ECommentParentType = {}));
var ESortType;
(function (ESortType) {
    ESortType[ESortType["Asc"] = 1] = "Asc";
    ESortType[ESortType["Desc"] = -1] = "Desc";
    ESortType[ESortType["Hot"] = 2] = "Hot";
})(ESortType = exports.ESortType || (exports.ESortType = {}));
//# sourceMappingURL=state.interface.js.map