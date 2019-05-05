import { CommentEntity } from '../comments/comment.entity';
import { PostMeta } from 'post-meta.entity';
import { DeepPartial } from 'typeorm';
import { BaseEntity } from '../base.entity';
export declare class PostEntity extends BaseEntity {
    constructor(input?: DeepPartial<PostEntity>);
    author: number;
    status: string;
    password: string;
    title: string;
    name: string;
    guid: string;
    excerpt: string;
    type: string;
    content: string[];
    block: any;
    allowComment: boolean;
    commentNum: number;
    parent: number;
    mimeType: string;
    menuOrder: number;
    sort: number;
    metas?: PostMeta[];
    comments?: CommentEntity[];
}
