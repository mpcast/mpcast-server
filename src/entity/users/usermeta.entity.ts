import {BaseEntity} from '@app/entity/base.entity';
import {DeepPartial, JoinColumn, Entity, OneToOne, Column, ManyToOne} from 'typeorm';
import {Users} from '@app/entity/users/users.entity';

@Entity()
export class UserMeta extends BaseEntity {
    constructor(input?: DeepPartial<UserMeta>) {
        super(input);
    }

    @Column()
    key: string;

    @Column({
        nullable: true,
        type: 'json',
        comment: '元信息值',
    })
    value?: any;

    @ManyToOne(type => Users, user => user.metas, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user?: Users;
}
