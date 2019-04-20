import { ArgsType, Field } from 'type-graphql';
import { Min, IsOptional } from 'class-validator';

@ArgsType()
export class QueryListArgs {
  @Field({nullable: true})
  @IsOptional()
  @Min(1)
  pageIndex: number = 1;

  @Field({nullable: true})
  @IsOptional()
  @Min(1)
  pageSize: number = 10;
}
