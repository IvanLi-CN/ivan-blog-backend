import { ArgsType, Field } from 'type-graphql';
import { MinLength, IsOptional } from 'class-validator';
import { QueryListArgs } from '../../common/dtos/query-list.args';

@ArgsType()
export class QueryAccountsArgs extends QueryListArgs {
  @Field({nullable: true})
  @IsOptional()
  nick?: string;
  @Field({nullable: true})
  @IsOptional()
  account?: string;
  @Field({nullable: true})
  @IsOptional()
  isActive?: boolean;
}
