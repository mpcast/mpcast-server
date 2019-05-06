import { OptionService } from '../../../service';
export declare class OptionController {
    private readonly optionService;
    constructor(optionService: OptionService);
    index(type: any): Promise<any>;
    all(): Promise<any>;
}
