import { DeepPartial } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from './user.entity';
export declare class UserMeta extends BaseEntity {
    constructor(input?: DeepPartial<UserMeta>);
    key: string;
    value?: any;
    user?: UserEntity;
}
