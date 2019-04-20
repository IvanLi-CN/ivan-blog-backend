import { Field, InputType, Int } from 'type-graphql';
import { IsOptional, IsDate, Length, MaxLength, IsArray, ArrayMinSize, IsPositive } from 'class-validator';

@InputType()
export class CreateArticleInput {
  @Field()
  @Length(1, 100)
  title: string;

  @Field({ nullable: true })
  @MaxLength(1000)
  @IsOptional()
  summary?: string;

  @Field({ nullable: true })
  @Length(1, 15000)
  @IsOptional()
  mdContent?: string;

  @Field({ nullable: true })
  @Length(1, 150000)
  @IsOptional()
  htmlContent?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  publishedAt?: Date;

  @Field(type => Int, { nullable: true })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMinSize(20)
  @IsPositive()
  tagIds?: number[];
}
