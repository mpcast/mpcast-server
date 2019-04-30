import {CommentMeta} from './comments/comment-meta.entity';
import {CommentEntity} from './comments/comment.entity';
import {Option} from './options/option.entity';
import {PostMeta} from './posts/post-meta.entity';
import {PostEntity} from './posts/post.entity';
import {TermMeta} from './terms/term-meta.entity';
import {TermRelationships} from './terms/term-relationships.entity';
import {TermTaxonomy} from './terms/term-taxonomy.entity';
import {Term} from './terms/term.entity';
import {UserMeta} from './users/user-meta.entity';
import {UserEntity} from './users/user.entity';
/**
 * A map of all the core database entities.
 * 核心的数据表实体
 */
export const coreEntitiesMap = {
  CommentMeta,
  CommentEntity,
  Option,
  PostMeta,
  PostEntity,
  TermMeta,
  TermTaxonomy,
  TermRelationships,
  Term,
  UserMeta,
  UserEntity,
};
