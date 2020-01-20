import { ArgsType, Field, ID } from 'type-graphql';
import { MinLength, IsOptional, IsInt, Min } from 'class-validator';
import { QueryListArgs } from '../../common/dtos/query-list.args';
import { ToInt } from '@neuralegion/class-sanitizer/dist';

@ArgsType()
export class QueryArticlesArgs extends QueryListArgs {
  @Field({nullable: true})
  @IsOptional()
  title?: string;
  @Field({nullable: true})
  @IsOptional()
  slug?: string;
  @Field(type => ID, {nullable: true})
  @IsInt()
  @ToInt()
  @IsOptional()
  @Min(1)
  authorId?: number;

  @Field({nullable: true})
  @IsOptional()
  isPublic?: boolean;
}
