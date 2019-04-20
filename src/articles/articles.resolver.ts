import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';
import { ArticlesArgs } from './dtos/articles.args';
import { Int } from 'type-graphql';
import { CreateArticleInput } from './dtos/create-article.input';
import { UpdateArticleInput } from './dtos/update-article.input';
import { ConflictException } from '@nestjs/common';

@Resolver(of => Article)
export class ArticlesResolver {

  constructor(
    private articlesService: ArticlesService,
  ) { }

  @Query(returns => [Article])
  async articles(@Args() args: ArticlesArgs): Promise<Article[]> {
    return await this.articlesService.findAll(args) as Article[];
  }

  @Query(returns => Int)
  async count(@Args() args: ArticlesArgs): Promise<number> {
    return await this.articlesService.findAll(args, true) as number;
  }

  @Mutation(returns => Article)
  async createArticle(@Args('createArticleInput')input: CreateArticleInput): Promise<Article> {
    if (!await this.articlesService.titleIsAvailable(input.title)) {
      throw new ConflictException(`文章标题「${input.title}」重复`);
    }
    return await this.articlesService.create(input);
  }

  @Mutation(returns => Article, {nullable: true})
  async updateArticle(@Args('id')id: number, @Args('updateArticleInput')input: UpdateArticleInput): Promise<Article> {
    await this.articlesService.update(id, input);
    return await this.articlesService.findOne(id);
  }

  @Mutation(returns => Boolean, {nullable: true})
  async removeArticle(@Args('id')id: number, @Args('updateArticleInput')input: UpdateArticleInput): Promise<boolean> {
    await this.articlesService.remove(id);
    return true;
  }
}
