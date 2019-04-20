import { Injectable } from '@nestjs/common';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { ArticlesArgs } from './dtos/articles.args';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleInput } from './dtos/create-article.input';
import { UpdateArticleInput } from './dtos/update-article.input';
import { MarkdownService } from '../common/services/markdown.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private markdownService: MarkdownService,
  ) { }

  async findAll(args: ArticlesArgs, isReturnCount: boolean = false) {
    const qb = this.articleRepository.createQueryBuilder('a');
    args.title && qb.andWhere('a.title LIKE :title', { title: `%${args.title}%` });
    if (isNaN(args.pageIndex)) {
      args.pageIndex = 1;
    }
    if (isNaN(args.pageSize)) {
      args.pageSize = 15;
    }
    qb.skip((args.pageIndex - 1) * args.pageSize);
    qb.take(args.pageSize);

    return isReturnCount ? qb.getCount() : qb.getMany();
  }

  async create(input: CreateArticleInput) {
    if (!input.publishedAt) {
      input.publishedAt = new Date();
    }
    if (!input.htmlContent) {
      input.htmlContent = this.markdownService.prase(input.mdContent);
    }
    return this.articleRepository.save(this.articleRepository.create(input));
  }

  async update(id: number, input: UpdateArticleInput) {
    if (!input.publishedAt) {
      input.publishedAt = new Date();
    }
    if (input.mdContent && !input.htmlContent) {
      input.htmlContent = this.markdownService.prase(input.mdContent);
    }
    this.articleRepository.update(id, input);
  }

  async remove(id: number) {
    this.articleRepository.update(id, {isDel: true});
  }

  async findOne(id: number) {
    return this.articleRepository.findOne(id);
  }

  async titleIsAvailable(title: string) {
    return !await this.articleRepository.findOne({title, isDel: false});
  }
}
