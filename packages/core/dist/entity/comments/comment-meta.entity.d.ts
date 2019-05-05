import { CommentEntity } from '..';
import { DeepPartial } from '../../common/shared-types';
import { BaseEntity } from '../base.entity';
export declare class CommentMeta extends BaseEntity {
    constructor(input?: DeepPartial<CommentMeta>);
    key: string;
    value: any;
    comment?: CommentEntity;
}
