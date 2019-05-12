import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { DeepPartial } from '../../common/shared-types';
import { ID } from '../../common/shared-types';
import { BaseEntity } from '../base.entity';

import { Term } from './term.entity';

/**
 * 分类法
 */
@Entity()
export class TermTaxonomy extends BaseEntity {
    constructor(input?: DeepPartial<TermTaxonomy>) {
        super(input);
    }

    @ManyToOne(type => Term, term => term.taxonomy, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    term: Term;

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
