import { Connection } from 'typeorm';
import { ID } from '../../common/shared-types';
import { Post as PostEntity, PostMeta } from '../../entity';
export declare class AttachmentService {
    private connection;
    constructor(connection: Connection);
    findById(id: ID): Promise<PostEntity | undefined>;
    getFormatData(item: PostEntity): Promise<PostEntity>;
    private getAttachmentInfo;
    private getAudios;
    getAttachment(postId: number, type?: string): Promise<any>;
    getAttachments(ids: number[]): Promise<PostMeta[]>;
}
