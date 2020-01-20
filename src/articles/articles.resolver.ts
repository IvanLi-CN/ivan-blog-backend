import { Args, Mutation, Query, ResolveProperty, Resolver, Root } from '@nestjs/graphql';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';
import { QueryArticlesArgs } from './dtos/query-articles-args';
import { Int } from 'type-graphql';
import { CreateArticleInput } from './dtos/create-article.input';
import { UpdateArticleInput } from './dtos/update-article.input';
import { NotFoundException, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Tag } from '../tags/tag.entity';
import { AccountGuard } from '../core/auth/guards/account.guard';
import { Account } from '../accounts/account.entity';

@UseGuards(AccountGuard)
@Resolver(() => Article)
export class ArticlesResolver {
  constructor(
    private articlesService: ArticlesService,
  ) {
  }

  @Query(returns => [Article])
  async articles(@Args() args: QueryArticlesArgs): Promise<Article[]> {
    return await this.articlesService.findAll(args) as Article[];
  }

  @Query(returns => Article)
  async article(
    @Args({ name: 'id', type: () => Int, nullable: true }) id?: number,
    @Args({ name: 'title', type: () => String, nullable: true }) title?: string,
    @Args({ name: 'slug', type: () => String, nullable: true }) slug?: string,
  ): Promise<Article> {
    const data = await (async () => {
      if (id) {
        return await this.articlesService.findOne(id) as Article;
      } else if (title) {
        return await this.articlesService.findOneByTitle(title) as Article;
      } else if (slug) {
        return await this.articlesService.findOneBySlug(slug) as Article;
      } else {
        throw new UnprocessableEntityException('请传入 id 或 title 来获取文章');
      }
    })();
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Query(returns => Int)
  async articlesCount(@Args() args: QueryArticlesArgs): Promise<number> {
    return await this.articlesService.findAll(args, true) as number;
  }

  @Mutation(returns => Article)
  async createArticle(@Args('createArticleInput')input: CreateArticleInput): Promise<Article> {
    return await this.articlesService.create(input);
  }

  @Mutation(returns => Article, { nullable: true })
  async updateArticle(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateArticleInput')input: UpdateArticleInput,
  ): Promise<Article> {
    return await this.articlesService.update(id, input);
  }

  @Mutation(returns => Boolean, { nullable: true })
  async removeArticle(@Args({ name: 'id', type: () => Int }) id: number): Promise<boolean> {
    await this.articlesService.remove(id);
    return true;
  }

  @ResolveProperty()
  async tags(@Root() article: Article): Promise<Tag[]> {
    return await this.articlesService.getArticleTags(article.id);
  }

  @ResolveProperty()
  async author(@Root() article: Article): Promise<Account> {
    return await this.articlesService.getArticleAuthor(article);
  }
}
