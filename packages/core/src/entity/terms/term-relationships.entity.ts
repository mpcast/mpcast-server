import { Column, Entity, Index, OneToOne, PrimaryColumn } from 'typeorm';

/**
 * 分类与分类对象关联表
 */
@Entity()
// @Index(['objectId', 'taxonomyId'])
export class TermRelationships {
  @PrimaryColumn({
    type: 'int',
    comment: '内容对象 id',
  })
  objectId: number;

  @PrimaryColumn({
    type: 'int',
    comment: '分类法 id',
  })
  taxonomyId: number;

  @Column({
    type: 'int',
    comment: '分类排序',
    default: 0,
  })
  sort: number;

  // @ManyToOne(type => TermTaxonomy, termTaxonomy => termTaxonomy.term, {
  //   cascade: true,
  // })
  // taxonomy: TermTaxonomy;
}
