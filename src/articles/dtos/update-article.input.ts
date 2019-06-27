import { Field, InputType, Int } from 'type-graphql';
import { MaxLength, MinLength, IsOptional, IsDate, Length, IsArray, ArrayMinSize, ArrayMaxSize, IsPositive } from 'class-validator';

@InputType()
export class UpdateArticleInput {
  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 100)
  title?: string;

  @Field()
  @Length(4, 200)
  slug?: string;

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

  @Field(type => [Int], {nullable: true})
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(20)
  @IsPositive({each: true})
  tagIds?: number[];
}
