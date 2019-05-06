import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DeepPartial } from '../../common/shared-types';
import { BaseEntity } from '../base.entity';

import { Term } from './term.entity';

// @Index(['name'], { unique: true })
/**
 * 分类项
 */
@Entity()
export class TermMeta extends BaseEntity {
  constructor(input?: DeepPartial<TermMeta>) {
    super(input);
  }

  @Column()
  key: string;

  @Column({
    nullable: true,
    type: 'text',
    comment: '元信息值',
  })
  value?: any;

  @ManyToOne(type => Term, term => term.metas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  term: Term;
}
