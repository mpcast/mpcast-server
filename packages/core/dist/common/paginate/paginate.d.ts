import { Repository, FindConditions, FindOneOptions } from 'typeorm';
import { Pagination } from './pagination';
import { IPaginationOptions } from './interfaces';
export declare function paginate<T>(repository: Repository<T>, options: IPaginationOptions, searchOptions?: FindOneOptions<T> | FindConditions<T>): Promise<Pagination<T>>;
