import { Resolver, Query, Args, Mutation, Root, ResolveProperty } from '@nestjs/graphql';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';
import { ArticlesArgs } from './dtos/articles.args';
import { Int } from 'type-graphql';
import { CreateArticleInput } from './dtos/create-article.input';
import { UpdateArticleInput } from './dtos/update-article.input';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Tag } from '../tags/tag.entity';

@Resolver(of => Article)
export class ArticlesResolver {
  constructor(
    private articlesService: ArticlesService,
  ) { }

  @Query(returns => [Article])
  async getArticles(@Args() args: ArticlesArgs): Promise<Article[]> {
    return await this.articlesService.findAll(args) as Article[];
  }

  @Query(returns => Article)
  async getArticle(
    @Args({name: 'id', type: () => Int, nullable: true}) id: number,
    @Args({name: 'title', type: () => String, nullable: true}) title: string,
  ): Promise<Article> {
    const data = await (async () => {
      if (id) {
        return await this.articlesService.findOne(id) as Article;
      } else if (title) {
        return await this.articlesService.findOneByTitle(title) as Article;
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
  async count(@Args() args: ArticlesArgs): Promise<number> {
    return await this.articlesService.findAll(args, true) as number;
  }

  @Mutation(returns => Article)
  async createArticle(@Args('createArticleInput')input: CreateArticleInput): Promise<Article> {
    return await this.articlesService.create(input);
  }

  @Mutation(returns => Article, {nullable: true})
  async updateArticle(@Args({name: 'id', type: () => Int}) id: number, @Args('updateArticleInput')input: UpdateArticleInput): Promise<Article> {
    return await this.articlesService.update(id, input);
  }

  @Mutation(returns => Boolean, {nullable: true})
  async removeArticle(@Args({name: 'id', type: () => Int}) id: number, @Args('updateArticleInput')input: UpdateArticleInput): Promise<boolean> {
    await this.articlesService.remove(id);
    return true;
  }

  @ResolveProperty()
  async tags(@Root() article: Article): Promise<Tag[]> {
    return await this.articlesService.getArticleTags(article.id);
  }
}
