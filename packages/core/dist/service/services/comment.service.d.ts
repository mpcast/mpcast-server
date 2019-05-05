import { Connection, Repository } from 'typeorm';
import { IPaginationOptions, Pagination } from '../../common/paginate';
import { ID } from '../../common/shared-types';
import { CommentEntity, UserEntity } from '../../entity';
export declare class CommentService {
    private connection;
    private readonly usersRepository;
    private readonly commentRepository;
    constructor(connection: Connection, usersRepository: Repository<UserEntity>, commentRepository: Repository<CommentEntity>);
    paginate(options: IPaginationOptions): Promise<Pagination<CommentEntity>>;
    findById(id: ID): Promise<CommentEntity | undefined>;
    create(comment: CommentEntity): Promise<CommentEntity>;
}
