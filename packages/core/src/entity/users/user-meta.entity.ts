import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DeepPartial } from '../../common/shared-types';
import { BaseEntity } from '../base.entity';

import { User } from './user.entity';

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

  @ManyToOne(type => User, user => user.metas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: User;
}
