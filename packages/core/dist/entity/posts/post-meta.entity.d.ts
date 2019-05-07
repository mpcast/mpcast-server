import { DeepPartial } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Post } from './post.entity';
export declare class PostMeta extends BaseEntity {
    constructor(input?: DeepPartial<PostMeta>);
    key: string;
    value: any;
    post?: Post;
}
