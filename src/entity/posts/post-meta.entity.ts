import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PostEntity } from '@app/entity';

@Entity()
export class PostMeta extends BaseEntity {
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

  @ManyToOne(type => PostEntity, post => post.metas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post?: PostEntity;
}
