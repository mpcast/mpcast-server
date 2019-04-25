import { BaseEntity } from '@app/entity/base.entity';
import { DeepPartial, JoinColumn, Entity, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '@app/entity/users/user.entity';

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
