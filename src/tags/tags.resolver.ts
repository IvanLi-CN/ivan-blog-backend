import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { Int } from 'type-graphql';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Tag } from './tag.entity';
import { TagsArgs } from './dtos/tags.args';
import { UpdateTagInput } from './dtos/update-tag.input';
import { CreateTagInput } from './dtos/create-tag.input';

@Resolver('Tag')
export class TagsResolver {
  constructor(
    private tagsService: TagsService,
  ) { }

  @Query(returns => [Tag])
  async getTags(@Args() args: TagsArgs): Promise<Tag[]> {
    return await this.tagsService.findAll(args) as Tag[];
  }

  @Query(returns => Tag)
  async getTag(
    @Args({name: 'id', type: () => Int, nullable: true}) id: number,
    @Args({name: 'name', type: () => String, nullable: true}) name: string,
  ): Promise<Tag> {
    const data = await (async () => {
      if (id) {
        return await this.tagsService.findOne(id) as Tag;
      } else if (name) {
        return await this.tagsService.findOneByName(name) as Tag;
      } else {
        throw new UnprocessableEntityException('请传入 id 或 name 来获取文章');
      }
    })();
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Query(returns => Int)
  async count(@Args() args: TagsArgs): Promise<number> {
    return await this.tagsService.findAll(args, true) as number;
  }

  @Mutation(returns => Tag)
  async createTag(@Args('createTagInput')input: CreateTagInput): Promise<Tag> {
    return await this.tagsService.create(input);
  }

  @Mutation(returns => Tag, {nullable: true})
  async updateTag(@Args({name: 'id', type: () => Int}) id: number, @Args('updateTagInput')input: UpdateTagInput): Promise<Tag> {
    return await this.tagsService.update(id, input);
  }

  @Mutation(returns => Boolean, {nullable: true})
  async removeTag(@Args({ name: 'id', type: () => Int }) id: number): Promise<boolean> {
    await this.tagsService.remove(id);
    return true;
  }
}
