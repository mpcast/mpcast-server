import { Column, DeepPartial, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base.entity';

import { UserEntity } from './user.entity';

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

  @ManyToOne(type => UserEntity, user => user.metas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: UserEntity;
}
