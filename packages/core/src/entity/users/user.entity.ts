import { Entity, OneToMany } from 'typeorm';
import { Column } from 'typeorm';

import { UserMeta } from '..';
import { DeepPartial } from '../../common/shared-types';
import { BaseEntity } from '../base.entity';
import { Comment } from '../comments/comment.entity';

@Entity('users')
export class User extends BaseEntity {
  constructor(input?: DeepPartial<User>) {
    super(input);
  }

  @Column({ unique: true })
  identifier: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  displayName?: string;

  @Column({ select: false, nullable: true })
  passwordHash?: string;

  @Column({ default: false })
  verified?: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationToken?: string | null;

  /**
   * @description
   * 用于更新用户标识的令牌,通常是一个邮件地址
   */
  @Column({ type: 'varchar', nullable: true })
  identifierChangeToken?: string | null;

  @OneToMany(type => UserMeta, userMeta => userMeta.user, {
    cascade: true,
    eager: true,
  })
  metas?: UserMeta[];

  @OneToMany(type => Comment, c => c.user, {
    cascade: true,
    eager: true,
  })
  comments?: Comment[];
}
