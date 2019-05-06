import { DeepPartial } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TermMeta } from './term-meta.entity';
import { TermTaxonomy } from './term-taxonomy.entity';
export declare class Term extends BaseEntity {
    constructor(input?: DeepPartial<Term>);
    name: string;
    slug: string;
    group: number;
    metas?: TermMeta[];
    taxonomy: TermTaxonomy;
}
