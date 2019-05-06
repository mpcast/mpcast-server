import { DeepPartial } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Term } from './term.entity';
export declare class TermMeta extends BaseEntity {
    constructor(input?: DeepPartial<TermMeta>);
    key: string;
    value?: any;
    term: Term;
}
