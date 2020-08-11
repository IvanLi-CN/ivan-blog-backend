import { ConflictException, Injectable } from '@nestjs/common';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { Tag } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsArgs } from './dtos/tags.args';
import { UpdateTagInput } from './dtos/update-tag.input';
import { CreateTagInput } from './dtos/create-tag.input';
import { Article } from '../articles/article.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) { }

  async findAll(args: TagsArgs, isReturnCount: boolean = false) {
    const qb = this.tagRepository.createQueryBuilder('a');
    args.name && qb.andWhere('a.name LIKE :name', { name: `%${args.name}%` });
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
  async create(input: CreateTagInput, @TransactionManager() manager?: EntityManager) {
    const repository = manager.getRepository(Tag);
    const old = await repository.findOne({name: input.name});
    if (old) {
      throw new ConflictException(`标签名称「${input.name}」重复`);
    }
    return await this.tagRepository.save(this.tagRepository.create(input));
  }

  @Transaction()
  async update(id: number, input: UpdateTagInput, @TransactionManager() manager?: EntityManager) {
    const repository = manager.getRepository(Tag);
    try {
      const old = await repository.findOne({name: input.name});
      if (old && old.id !== id) {
        throw new ConflictException(`标签名称「${input.name}」重复`);
      }
      await repository.update(id, {...input});
    } catch (e) {
      console.error(e);
      throw e;
    }
    return await repository.findOne(id);
  }

  async remove(id: number) {
    await this.tagRepository.delete(id);
  }

  async findOne(id: number) {
    return await this.tagRepository.findOne(id);
  }

  async findOneByName(name: string) {
    return await this.tagRepository.findOne({name});
  }

  async findArticlesByTagId(id: number): Promise<Article[]> {
    return (await this.tagRepository.findOne({
      where: {id},
      relations: ['articles'],
    }))?.articles ?? [];
  }
}
