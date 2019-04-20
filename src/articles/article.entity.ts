import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Tag } from '../tags/tag.entity';

@ObjectType()
@Entity()
export class Article {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Index()
  @Column({type: 'varchar', length: 200, comment: '文章标题'})
  title: string;

  @Field({ nullable: true })
  @Column({type: 'varchar', length: 1000, default: '', comment: '文章摘要'})
  summary: string;

  @Field()
  @Column({type: 'varchar', length: 15000, comment: '文章正文（MD）'})
  mdContent: string;

  @Field()
  @Column({type: 'mediumtext', comment: '文章正文（MD）'})
  htmlContent: string;

  @Field(type => [Tag])
  @JoinTable()
  @ManyToMany(type => Tag, tag => tag.articles, {onDelete: 'CASCADE'})
  tags: Tag[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  publishedAt: Date;

  @Column({default: false})
  isDel: boolean;
}
