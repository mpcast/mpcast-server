import { DeepPartial, ID } from '../common/shared-types';
export declare abstract class BaseEntity {
    protected constructor(input?: DeepPartial<BaseEntity>);
    id: ID;
    createdAt?: Date;
    updatedAt?: Date;
}
