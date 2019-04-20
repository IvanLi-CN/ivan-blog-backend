import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

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

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  publishedAt: Date;

  @Field()
  @Column({default: false})
  isDel: boolean;
}
