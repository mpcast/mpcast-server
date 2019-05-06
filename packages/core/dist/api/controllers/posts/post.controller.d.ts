import { ID } from '../../../common/shared-types';
import { IQueryParamsResult } from '../../../decorators/query-params.decorator';
import { CommentEntity, PostEntity } from '../../../entity';
import { AttachmentService, CategoriesService, CommentService, OptionService, PostService, UserService } from '../../../service';
export declare class PostController {
    private readonly userService;
    private readonly postService;
    private readonly optionService;
    private readonly categoriesService;
    private readonly attachmentService;
    private readonly commentService;
    constructor(userService: UserService, postService: PostService, optionService: OptionService, categoriesService: CategoriesService, attachmentService: AttachmentService, commentService: CommentService);
    index(page?: number, limit?: number): Promise<import("../../../common/paginate/pagination").Pagination<PostEntity>>;
    findByCategory(req: any, category: any, page?: number, limit?: number): Promise<any>;
    getViews(postId: ID, req: any): Promise<{
        found: number;
        iView: boolean;
        postId: ID;
        views: import("../../../entity/index").UserEntity[];
    }>;
    newViewer(postId: ID, req: any, params: IQueryParamsResult): Promise<{
        iView: boolean;
        viewCount: number;
        postId: ID;
    }>;
    getComments(postId: ID, req: any, page: number, limit: number): Promise<import("../../../common/paginate/pagination").Pagination<CommentEntity>>;
    newComment(postId: ID, req: any, params: IQueryParamsResult, comment: CommentEntity): Promise<CommentEntity>;
    one(id: ID): Promise<any>;
    private decoratorSingleData;
    private dealDataList;
    private _formatOneData;
    private decoratorTerms;
    private decoratorTags;
    private dealBlock;
    private formatData;
    private decoratorIsPage;
}
