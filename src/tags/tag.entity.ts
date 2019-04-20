import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

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
}
