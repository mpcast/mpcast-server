import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { OptionService } from '@app/modules/options/option.service';
// import * as _ from 'lodash';

// import { Post } from './post.entity';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly optionService: OptionService,
    // private readonly cacheService: CacheService,
  ) {
  }

  @Get()
  root(): Promise<any> {
    return this.categoriesService.getTermsByTaxonomy('category');
  }

  @Get(':taxonomy/:slug')
  findByTaxonomySlug(@Param('slug') slug, @Param('taxonomy') taxonomy): Promise<any> {
    // let taxonomy: string;
    // if (_.has(req.querys, 'taxonomy')) {
    //   taxonomy = req.querys.taxonomy;
    // } else {
    //   taxonomy = 'category';
    // }
    return this.categoriesService.findTermBySlug(taxonomy, slug);
  }

  // @Get(':taxonomy')
  // getTermsByTaxonomy(@Param('taxonomy') taxonomy): Promise<any> {
  // return this.categoriesService.findTermBySlug(taxonomy, slug);
  // }
}
