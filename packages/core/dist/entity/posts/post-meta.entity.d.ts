import { DeepPartial } from 'typeorm';
import { PostEntity } from '..';
import { BaseEntity } from '../base.entity';
export declare class PostMeta extends BaseEntity {
    constructor(input?: DeepPartial<PostMeta>);
    key: string;
    value: any;
    post?: PostEntity;
}
