import { CommentEntity, UserMeta } from '..';
import { BaseEntity } from '../base.entity';
import { DeepPartial, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Column } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  constructor(input?: DeepPartial<UserEntity>) {
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

  @OneToMany(type => CommentEntity, comment => comment.user, {
    cascade: true,
  })
  comments?: CommentEntity[];
}
