import { DeepPartial } from 'typeorm';
export declare class Option {
    constructor(input?: DeepPartial<Option>);
    key: string;
    value?: any;
    description: string;
}
