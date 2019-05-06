import { Controller, Get, Param } from '@nestjs/common';

import { CategoriesService } from '../../../service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {
  }

  @Get()
  root(): Promise<any> {
    return this.categoriesService.getTermsByTaxonomy('category');
  }

  @Get(':taxonomy/:slug')
  findByTaxonomySlug(@Param('slug') slug: any, @Param('taxonomy') taxonomy: any): Promise<any> {
    return this.categoriesService.findTermBySlug(taxonomy, slug);
  }
}
