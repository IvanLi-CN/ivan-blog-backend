import { ConflictException, Injectable } from '@nestjs/common';
import { Article } from './article.entity';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
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

    return isReturnCount ? await qb.getCount() : await qb.getMany();
  }

  @Transaction()
  async create(input: CreateArticleInput, @TransactionManager() manager?: EntityManager) {
    const repository = manager.getRepository(Article);
    const old = await repository.findOne({title: input.title});
    if (old) {
      throw new ConflictException(`文章标题「${input.title}」重复`);
    }
    if (!input.publishedAt) {
      input.publishedAt = new Date();
    }
    if (!input.htmlContent) {
      input.htmlContent = this.markdownService.prase(input.mdContent);
    }
    return await repository.save(this.articleRepository.create(input));
  }

  @Transaction()
  async update(id: number, input: UpdateArticleInput, @TransactionManager() manager?: EntityManager) {
    const repository = manager.getRepository(Article);
    const old = await repository.findOne({title: input.title});
    if (old && old.id !== id) {
      throw new ConflictException(`文章标题「${input.title}」重复`);
    }
    if (!input.publishedAt) {
      input.publishedAt = new Date();
    }
    if (input.mdContent && !input.htmlContent) {
      input.htmlContent = this.markdownService.prase(input.mdContent);
    }
    await repository.update(id, input);
    return await repository.findOne(id);
  }

  async remove(id: number) {
    await this.articleRepository.update(id, {isDel: true});
  }

  async findOne(id: number) {
    return await this.articleRepository.findOne(id);
  }

  async findOneByTitle(title: string) {
    return await this.articleRepository.findOne({title, isDel: false});
  }
}
