import { Connection } from 'typeorm';
import { IPaginationOptions, Pagination } from '../../common/paginate';
import { ID } from '../../common/shared-types';
import { Comment } from '../../entity';
export declare class CommentService {
    private connection;
    constructor(connection: Connection);
    paginate(options: IPaginationOptions): Promise<Pagination<Comment>>;
    findById(id: ID): Promise<Comment | undefined>;
    create(comment: Comment): Promise<Comment>;
}
