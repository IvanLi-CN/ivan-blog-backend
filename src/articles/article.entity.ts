import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Tag } from '../tags/tag.entity';
import { AppBaseEntity } from '../common/entities/app-base-entity';
import { Account } from '../accounts/account.entity';

@ObjectType()
@Entity()
export class Article extends AppBaseEntity {
  @Field()
  @Index()
  @Column({ type: 'varchar', length: 200, comment: '文章标题' })
  title: string;

  @Field()
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 200, comment: '文章 slug' })
  slug: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 1000, default: '', comment: '文章摘要' })
  summary: string;

  @Field()
  @Column({ type: 'text', comment: '文章正文（MD）', nullable: true })
  mdContent: string;

  @Field()
  @Column({ type: 'text', comment: '文章正文（HTML）' })
  htmlContent: string;

  @Field(type => [Tag])
  @JoinTable()
  @ManyToMany(type => Tag, tag => tag.articles, { onDelete: 'CASCADE' })
  tags: Tag[];

  @Field()
  @ManyToOne(type => Account, account => account.articles)
  author: Account;

  @Field(type => Int)
  @Column()
  authorId: number;

  @Field()
  @Column()
  publishedAt: Date;

  @Column({ default: false, select: false })
  isDelete: boolean;

  @Field()
  @Column({ default: true })
  isPublic: boolean;
}
