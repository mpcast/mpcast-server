import { PostEntity, UserEntity } from '..';
import { DeepPartial } from '../../common/shared-types';
import { BaseEntity } from '../base.entity';
import { CommentMeta } from './comment-meta.entity';
export declare class CommentEntity extends BaseEntity {
    constructor(input?: DeepPartial<CommentEntity>);
    approved: string;
    content: string;
    ip: string;
    commentCount: number;
    parent: number;
    metas?: CommentMeta[];
    post: PostEntity;
    user: UserEntity;
}
