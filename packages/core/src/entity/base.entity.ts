import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

import {DeepPartial, ID} from '../common/shared-types';

// const keyType = primaryKeyType();

/**
 * @description
 * 所有 entities 继承此类
 * @docsCategory entities
 */
export abstract class BaseEntity {
    protected constructor(input?: DeepPartial<BaseEntity>) {
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                (this as any)[key] = value;
            }
        }
    }

    @PrimaryGeneratedColumn('increment') id: ID;

    @CreateDateColumn() createdAt?: Date;

    @UpdateDateColumn() updatedAt?: Date;
}
