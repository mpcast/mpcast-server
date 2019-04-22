import { Column, DeepPartial, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Term } from '@app/entity/terms/term.entity';

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
    type: 'json',
    comment: '元信息值',
  })
  value?: any;

  @ManyToOne(type => Term, term => term.metas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  term?: Term;
}
