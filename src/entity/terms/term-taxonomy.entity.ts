import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Term } from '@app/entity/terms/term.entity';
import { ID } from '@app/common/shared-types';

/**
 * 分类法
 */
@Entity()
export class TermTaxonomy extends BaseEntity {
  @OneToOne(type => Term, term => term.taxonomy)
  @Column({
    type: 'int',
    comment: '分类 id',
  })
  termId: Term;

  @Column({
    type: 'varchar',
    length: 200,
    comment: '分类法',
  })
  taxonomy: string;

  @Column({
    type: 'varchar',
    length: 200,
    comment: '描述',
  })
  description: string;

  @Column({
    type: 'int',
    comment: '父类',
    default: 0,
  })
  parent: ID;

  @Column({
    type: 'int',
    comment: '类别下面的内容数量',
    default: 0,
  })
  count: number;
}
