import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TermMeta } from '@app/entity/terms/term-meta.entity';
import { TermTaxonomy } from '@app/entity/terms/term-taxonomy.entity';
import { TermRelationships } from '@app/entity';

// @Index(['name'], { unique: true })
/**
 * 分类项
 */
@Entity('terms')
export class Term extends BaseEntity {
  @Column('varchar', {
    length: 200,
    comment: '名称',
  })
  name: string;

  @Column('varchar', {
    length: 200,
    comment: '名称地址标识',
    unique: true,
  })
  slug: string;

  @Column({
    type: 'int',
    comment: '排序分组',
    default: 0,
  })
  group: number;

  @OneToMany(type => TermMeta, termMeta => termMeta.term, {
    cascade: true,
  })
  metas?: TermMeta[];

  @OneToOne(type => TermTaxonomy, termTaxonomy => termTaxonomy.term, {
    cascade: true,
  })
  taxonomy: TermTaxonomy;

  // @OneToOne(type => TermRelationships, termRelationships => termRelationships.taxonomy, {
  //   cascade: true,
  // })
  // termRelationships: TermRelationships;
}
