import { Connection, Repository } from 'typeorm';
import { CacheService } from '../../cache/cache.service';
import { ID } from '../../common/shared-types';
import { Option } from '../../entity';
export declare class OptionService {
    private readonly connection;
    private readonly optionRepository;
    private readonly cacheService;
    constructor(connection: Connection, optionRepository: Repository<Option>, cacheService: CacheService);
    initOptions(): Promise<void>;
    load(flag?: boolean): Promise<any>;
    updateOptions(optionKey: any, optionValue: any): Promise<any>;
    addSticky(key: string, itemId: ID): Promise<any>;
    removeSticky(key: string, itemId: ID): Promise<void>;
    saveSticky(stickys: {
        [key: string]: [ID];
    }): Promise<import("typeorm").UpdateResult>;
}
