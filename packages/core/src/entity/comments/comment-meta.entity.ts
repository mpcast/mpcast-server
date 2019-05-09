import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DeepPartial } from '../../common/shared-types';
import { BaseEntity } from '../base.entity';

import { Comment } from './comment.entity';

@Entity()
export class CommentMeta extends BaseEntity {
  constructor(input?: DeepPartial<CommentMeta>) {
    super(input);
  }

  @Column({
    name: 'key',
    comment: '元数据键标识',
  })
  key: string;

  @Column({
    name: 'value',
    type: 'json',
    nullable: true,
    comment: '元数据值',
  })
  value: any;

  @ManyToOne(type => Comment, comment => comment.metas, {
    onDelete: 'CASCADE',
  })
  comment?: Comment;
}
