import { CommentService, UserService } from '../../../service';
export declare class CommentController {
    private readonly userService;
    private readonly commentService;
    constructor(userService: UserService, commentService: CommentService);
    index(page?: number, limit?: number): Promise<import("../../../common/paginate/pagination").Pagination<import("../../../entity/index").CommentEntity>>;
    one(id: any): Promise<import("../../../entity/index").CommentEntity | undefined>;
}
