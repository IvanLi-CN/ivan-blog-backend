import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Article } from '../articles/article.entity';

@ObjectType()
@Entity()
export class Tag {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Index()
  @Column({length: 50, comment: '标签名称'})
  name: string;

  @Field()
  @Column()
  isAvailable: boolean;

  @Field()
  @Column()
  isVisible: boolean;

  @Field(type => [Article], {defaultValue: []})
  @ManyToMany(type => Article, article => article.tags, {onDelete: 'CASCADE'})
  articles: Article[];
}
