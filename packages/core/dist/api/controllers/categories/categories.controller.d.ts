import { CategoriesService } from '../../../service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    root(): Promise<any>;
    findByTaxonomySlug(slug: any, taxonomy: any): Promise<any>;
}
