import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { Tag } from '../tags/tag.entity';
import { BaseEntity } from '../common/entities/base.entity';

@ObjectType()
@Entity()
export class Article extends BaseEntity {
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
  @Column({ type: 'mediumtext', comment: '文章正文（MD）', nullable: true })
  mdContent: string;

  @Field()
  @Column({ type: 'mediumtext', comment: '文章正文（HTML）' })
  htmlContent: string;

  @Field(type => [Tag])
  @JoinTable()
  @ManyToMany(type => Tag, tag => tag.articles, { onDelete: 'CASCADE' })
  tags: Tag[];

  @Field()
  @Column()
  publishedAt: Date;

  @Column({ default: false })
  isDelete: boolean;
}
