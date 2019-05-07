import { UserMeta } from '..';
import { DeepPartial } from '../../common/shared-types';
import { BaseEntity } from '../base.entity';
import { Comment } from '../comments/comment.entity';
export declare class User extends BaseEntity {
    constructor(input?: DeepPartial<User>);
    identifier: string;
    displayName?: string;
    passwordHash?: string;
    verified?: boolean;
    verificationToken?: string | null;
    identifierChangeToken?: string | null;
    metas?: UserMeta[];
    comments?: Comment[];
}
