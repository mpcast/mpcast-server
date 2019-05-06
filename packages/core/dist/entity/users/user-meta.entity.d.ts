import { DeepPartial } from '../../common/shared-types';
import { BaseEntity } from '../base.entity';
import { User } from './user.entity';
export declare class UserMeta extends BaseEntity {
    constructor(input?: DeepPartial<UserMeta>);
    key: string;
    value?: any;
    user?: User;
}
