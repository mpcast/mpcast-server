import { CommentEntity, UserMeta } from '..';
import { BaseEntity } from '../base.entity';
import { DeepPartial } from 'typeorm';
export declare class UserEntity extends BaseEntity {
    constructor(input?: DeepPartial<UserEntity>);
    identifier: string;
    displayName?: string;
    passwordHash?: string;
    verified?: boolean;
    verificationToken?: string | null;
    identifierChangeToken?: string | null;
    metas?: UserMeta[];
    comments?: CommentEntity[];
}
