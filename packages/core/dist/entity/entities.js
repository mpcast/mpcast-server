"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_meta_entity_1 = require("./comments/comment-meta.entity");
const comment_entity_1 = require("./comments/comment.entity");
const option_entity_1 = require("./options/option.entity");
const post_meta_entity_1 = require("./posts/post-meta.entity");
const post_entity_1 = require("./posts/post.entity");
const term_meta_entity_1 = require("./terms/term-meta.entity");
const term_relationships_entity_1 = require("./terms/term-relationships.entity");
const term_taxonomy_entity_1 = require("./terms/term-taxonomy.entity");
const term_entity_1 = require("./terms/term.entity");
const user_meta_entity_1 = require("./users/user-meta.entity");
const user_entity_1 = require("./users/user.entity");
exports.coreEntitiesMap = {
    Option: option_entity_1.Option,
    TermMeta: term_meta_entity_1.TermMeta,
    TermTaxonomy: term_taxonomy_entity_1.TermTaxonomy,
    TermRelationships: term_relationships_entity_1.TermRelationships,
    Term: term_entity_1.Term,
    CommentMeta: comment_meta_entity_1.CommentMeta,
    Comment: comment_entity_1.Comment,
    PostMeta: post_meta_entity_1.PostMeta,
    PostEntity: post_entity_1.PostEntity,
    UserMeta: user_meta_entity_1.UserMeta,
    User: user_entity_1.User,
};
//# sourceMappingURL=entities.js.map