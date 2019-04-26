import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@app/modules/users/user.module';
import { Term, TermMeta, TermRelationships, TermTaxonomy } from '@app/entity';
import { OptionModule } from '@app/modules/options/option.module';
import { CategoriesService } from '@app/modules/categories/categories.service';
import { CategoriesController } from '@app/modules/categories/categories.controller';
import { CacheModule } from '@app/processors/cache/cache.module';
import { AttachmentModule } from '@app/modules/attachments/attachment.module';

@Module({
  imports: [
    UserModule,
    OptionModule,
    CacheModule,
    AttachmentModule,
    TypeOrmModule.forFeature([
      Term,
      TermMeta,
      TermRelationships,
      TermTaxonomy,
    ]),
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {

}
