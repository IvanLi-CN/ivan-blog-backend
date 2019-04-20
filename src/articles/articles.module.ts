import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesResolver } from './articles.resolver';
import { Article } from './article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    CommonModule,
  ],
  providers: [ArticlesService, ArticlesResolver],

})
export class ArticlesModule {}
