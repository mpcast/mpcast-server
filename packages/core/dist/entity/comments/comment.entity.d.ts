import { Post, User } from '..';
import { DeepPartial } from '../../common/shared-types';
import { BaseEntity } from '../base.entity';
import { CommentMeta } from './comment-meta.entity';
export declare class Comment extends BaseEntity {
    constructor(input?: DeepPartial<Comment>);
    approved: string;
    content: string;
    ip: string;
    commentCount: number;
    metas?: CommentMeta[];
    user: User;
    post: Post;
}
