// import { CommentMeta } from './comments/comment-meta.entity';
// import { Comment } from './comments/comment.entity';
import { CommentMeta } from './comments/comment-meta.entity';
import { Comment } from './comments/comment.entity';
import { Option } from './options/option.entity';
import { PostMeta } from './posts/post-meta.entity';
import { Post } from './posts/post.entity';
import { TermMeta } from './terms/term-meta.entity';
import { TermRelationships } from './terms/term-relationships.entity';
import { TermTaxonomy } from './terms/term-taxonomy.entity';
import { Term } from './terms/term.entity';
import { UserMeta } from './users/user-meta.entity';
import { User } from './users/user.entity';

/**
 * A map of all the core database entities.
 * 核心的数据表实体
 */
export const coreEntitiesMap = {
  Option,
  TermMeta,
  TermTaxonomy,
  TermRelationships,
  Term,
  CommentMeta,
  Comment,
  PostMeta,
  Post,
  UserMeta,
  User,
};
