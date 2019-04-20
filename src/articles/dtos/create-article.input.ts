import { Field, InputType } from 'type-graphql';
import { MaxLength, MinLength, IsOptional, IsDate } from 'class-validator';

@InputType()
export class CreateArticleInput {
  @Field()
  @MaxLength(100)
  @MinLength(1)
  title: string;

  @Field({ nullable: true })
  @MaxLength(1000)
  @IsOptional()
  summary?: string;

  @Field({ nullable: true })
  @MaxLength(15000)
  @MinLength(1)
  @IsOptional()
  mdContent?: string;

  @Field({ nullable: true })
  @MaxLength(150000)
  @MinLength(1)
  @IsOptional()
  htmlContent?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  publishedAt?: Date;
}
