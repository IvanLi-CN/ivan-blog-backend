import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Article } from './article.entity';
import { EntityManager, getConnection, Repository, Transaction, TransactionManager } from 'typeorm';
import { QueryArticlesArgs } from './dtos/query-articles-args';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleInput } from './dtos/create-article.input';
import { UpdateArticleInput } from './dtos/update-article.input';
import { MarkdownService } from '../common/services/markdown.service';
import { Tag } from '../tags/tag.entity';
import { BaseDbService } from '../common/services/base-db.service';

@Injectable()
export class ArticlesService extends BaseDbService<Article> {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private markdownService: MarkdownService,
  ) {
    super();
  }

  async findAll(args: QueryArticlesArgs, isReturnCount: boolean = false) {
    const qb = this.articleRepository.createQueryBuilder('a');
    BaseDbService.filterLike(qb, 'a', 'title', args);
    BaseDbService.filterEqual(qb, 'a', 'slug', args);
    BaseDbService.filterEqual(qb, 'a', 'isPublic', args);
    BaseDbService.baseQuery(qb, 'a', args);

    return isReturnCount ? await qb.getCount() : await qb.getMany();
  }

  async create(input: CreateArticleInput) {
    const id = await getConnection().transaction(async manager => {
      const repository = manager.getRepository(Article);
      const tagRepository = manager.getRepository(Tag);
      const old = await repository.findOne({ title: input.title });
      if (old) {
        throw new ConflictException(`文章标题「${input.title}」重复`);
      }
      if (!input.publishedAt) {
        input.publishedAt = new Date();
      }
      if (!input.htmlContent) {
        if (!input.mdContent) {
          throw new UnprocessableEntityException('请传入 HTML 或 MarkDown 格式的正文。文章内容不得为空');
        }
        input.htmlContent = this.markdownService.prase(input.mdContent);
      }
      const tags = input.tagIds.length === 0 ?
        [] :
        await tagRepository.createQueryBuilder('t').whereInIds(input.tagIds).getMany();
      const tmpArticle = this.articleRepository.create(input);
      tmpArticle.tags = tags;
      const {identifiers} = await repository.insert(tmpArticle);
      return identifiers[0].id;
    });
    return await this.findOne(id);
  }

  @Transaction()
  async update(id: number, input: UpdateArticleInput, @TransactionManager() manager?: EntityManager) {
    const repository = manager.getRepository(Article);
    const tagRepository = manager.getRepository(Tag);
    const old = await repository.findOne({ title: input.title });
    if (old && old.id !== id) {
      throw new ConflictException(`文章标题「${input.title}」重复`);
    }
    if (!input.publishedAt) {
      input.publishedAt = new Date();
    }
    if (input.mdContent && !input.htmlContent) {
      input.htmlContent = this.markdownService.prase(input.mdContent);
    }
    if (input.tagIds) {
      const tags = await tagRepository.createQueryBuilder('t').whereInIds(input.tagIds).getMany();
      await repository.save(repository.merge(old, input, { tags }));
    } else {
      await repository.save(repository.merge(old, input));
    }
    return await repository.findOne(id);
  }

  async remove(id: number) {
    await this.articleRepository.update(id, { isDelete: true });
  }

  async findOne(id: number) {
    console.log('id', id, typeof id);
    return await this.articleRepository.findOne({
      where: {id},
      relations: ['author'],
    }).then(v => {
      console.log('v', v);
      return v;
    });
  }

  async findOneByTitle(title: string) {
    return await this.articleRepository.findOne({ title: `%${title}%`, isDelete: false });
  }

  async findOneBySlug(slug: string) {
    return await this.articleRepository.findOne({ slug, isDelete: false });
  }

  async getArticleTags(articleId: number) {
    const article = await this.articleRepository.createQueryBuilder('a')
      .select(['a.id'])
      .leftJoinAndSelect('a.tags', 'tag')
      .where('a.id = :id', { id: articleId })
      .getOne();
    if (!article) {
      throw new NotFoundException();
    }
    return article.tags;
  }
}
