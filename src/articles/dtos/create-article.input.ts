import { Field, ID, InputType, Int } from 'type-graphql';
import { IsInt, IsOptional, IsDate, Length, MaxLength, IsArray, ArrayMinSize, IsPositive, ArrayMaxSize, Min } from 'class-validator';
import { ToInt } from '@neuralegion/class-sanitizer/dist';

@InputType()
export class CreateArticleInput {
  @Field()
  @Length(1, 100)
  title: string;

  @Field()
  @Length(4, 200)
  slug: string;

  @Field({ nullable: true })
  @MaxLength(1000)
  @IsOptional()
  summary?: string;

  @Field(() => ID)
  @IsInt()
  @ToInt()
  @Min(1)
  authorId?: number;

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

  @Field(type => [Int], {defaultValue: []})
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(20)
  @IsPositive({each: true})
  tagIds: number[];
  @Field()
  isPublic?: boolean;
}
