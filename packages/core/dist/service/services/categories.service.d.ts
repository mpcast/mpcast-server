import { Connection } from 'typeorm';

import { CacheService } from '../../cache/cache.service';
import { ID } from '../../common/shared-types';
import { PostMeta, Term } from '../../entity';

import { AttachmentService } from './attachment.service';
export declare class CategoriesService {
    private connection;
    private readonly cacheService;
    private readonly attachmentService;
    constructor(connection: Connection, cacheService: CacheService, attachmentService: AttachmentService);
    findTermBySlug(taxonomy: string, slug: string): Promise<any>;
    findCategoriesByObject(objectId: ID): Promise<any[]>;
    formatTermForObject(objectId: ID): Promise<Term | undefined>;
    getFromCategory(categorySlug: string, status?: string, querys?: any): Promise<Array<{
        id: string;
        author: string | number;
        status: string;
        guid?: string | undefined;
        allowComment: number;
        menuOrder?: number | undefined;
        block?: JSON | undefined;
        sort: number;
        createdAt: string;
        updateAt: string;
        commentNum?: number | undefined;
        parent: number;
        mimeType?: string | undefined;
        password?: string | undefined;
        title: string;
        name?: string | undefined;
        excerpt?: string | undefined;
        type: string;
        content: string;
        category: string;
        metas?: PostMeta[] | undefined;
    }>>;
    getPopular(isRandom?: boolean, limit?: number): Promise<any>;
    getNews(limit: number): Promise<any>;
    getStickys(stickys: [number]): Promise<any[]>;
    getTermsByTaxonomy(taxonomy: string): Promise<any>;
    getTagsByObject(objectId: ID): Promise<void>;
    loadAllTerms(flag?: boolean): Promise<any>;
    private formatMeta;
}
