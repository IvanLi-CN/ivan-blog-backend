import { ArgsType, Field } from 'type-graphql';
import { MinLength, IsOptional } from 'class-validator';
import { QueryListArgs } from '../../common/dtos/query-list.args';

@ArgsType()
export class ArticlesArgs extends QueryListArgs {
  @Field({nullable: true})
  @IsOptional()
  @MinLength(1)
  title?: string;
}
