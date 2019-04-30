import { CategoriesService } from '../../../service';
import { Controller, Get, Param } from '@nestjs/common';

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
  findByTaxonomySlug(@Param('slug') slug, @Param('taxonomy') taxonomy): Promise<any> {
    return this.categoriesService.findTermBySlug(taxonomy, slug);
  }
}
