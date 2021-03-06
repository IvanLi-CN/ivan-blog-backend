import { ArgsType, Field } from '@nestjs/graphql';
import { MinLength, IsOptional } from 'class-validator';
import { QueryListArgs } from '../../common/dtos/query-list.args';

@ArgsType()
export class TagsArgs extends QueryListArgs {
  @Field({nullable: true})
  @IsOptional()
  @MinLength(1)
  name?: string;
}
