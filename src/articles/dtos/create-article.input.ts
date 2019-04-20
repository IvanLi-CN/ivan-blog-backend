import { Field, InputType } from 'type-graphql';
import { IsOptional, IsDate, Length, MaxLength } from 'class-validator';

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
}
