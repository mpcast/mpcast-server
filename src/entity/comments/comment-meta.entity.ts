import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Comment } from '@app/entity';

@Entity()
export class CommentMeta extends BaseEntity {
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
  @JoinColumn()
  comment?: Comment;
}
