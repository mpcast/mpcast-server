import { DeepPartial } from '../../common/shared-types';
import { BaseEntity } from '../base.entity';
import { CommentEntity } from './comment.entity';
export declare class CommentMeta extends BaseEntity {
    constructor(input?: DeepPartial<CommentMeta>);
    key: string;
    value: any;
    comment?: CommentEntity;
}
