import { DeepPartial } from '../../common/shared-types';
import { ID } from '../../common/shared-types';
import { BaseEntity } from '../base.entity';
import { Term } from './term.entity';
export declare class TermTaxonomy extends BaseEntity {
    constructor(input?: DeepPartial<TermTaxonomy>);
    term: Term;
    taxonomy: string;
    description: string;
    parent: ID;
    count: number;
}
