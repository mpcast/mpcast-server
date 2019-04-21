import {BaseEntity} from '@app/entity/base.entity';
import {DeepPartial, Entity, OneToMany} from 'typeorm';
import {Column} from 'typeorm';
import {UserMeta} from '@app/entity';

@Entity()
export class Users extends BaseEntity {
    constructor(input?: DeepPartial<Users>) {
        super(input);
    }

    @Column({unique: true})
    identifier: string;

    @Column({select: false})
    passwordHash: string;

    @Column({default: false})
    verified?: boolean;

    @Column({type: 'varchar', nullable: true})
    verificationToken?: string | null;

    /**
     * @description
     * 用于更新用户标识的令牌,通常是一个邮件地址
     */
    @Column({type: 'varchar', nullable: true})
    identifierChangeToken?: string | null;

    @OneToMany(type => UserMeta, userMeta => userMeta.user, {
        cascade: true,
    })
    metas?: UserMeta[];
}
