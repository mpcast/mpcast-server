import { CacheService } from '../../cache/cache.service';
import { PostMeta } from '../../entity';
import { Connection } from 'typeorm';
export declare class TermService {
    private connection;
    private readonly cacheService;
    constructor(connection: Connection, cacheService: CacheService);
    findTermBySlug(taxonomy: string, slug: string): Promise<any>;
    getFromCategory(categorySlug: string, status?: string, querys?: any): Promise<{
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
    }[]>;
    getPopular(isRandom?: boolean, limit?: number): Promise<any>;
    getNews(limit: number): Promise<any>;
    getStickys(stickys: [number]): Promise<any[]>;
    getTermsByTaxonomy(taxonomy: string): Promise<any>;
    loadAllTerms(flag?: boolean): Promise<any>;
    private formatMeta;
}
