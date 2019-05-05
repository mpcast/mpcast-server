import { BaseEntity } from '../base.entity';
import { UserEntity } from 'user.entity';
import { DeepPartial } from 'typeorm';
export declare class UserMeta extends BaseEntity {
    constructor(input?: DeepPartial<UserMeta>);
    key: string;
    value?: any;
    user?: UserEntity;
}
