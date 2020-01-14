import { ArgsType, Field } from 'type-graphql';
import { MinLength, IsOptional, IsInt, Min } from 'class-validator';
import { QueryListArgs } from '../../common/dtos/query-list.args';

@ArgsType()
export class QueryArticlesArgs extends QueryListArgs {
  @Field({nullable: true})
  @IsOptional()
  title?: string;
  @Field({nullable: true})
  @IsOptional()
  slug?: string;
  @Field({nullable: true})
  @IsInt()
  @IsOptional()
  @Min(1)
  authorId?: number;

  @Field({nullable: true})
  @IsOptional()
  isPublic?: boolean;
}
