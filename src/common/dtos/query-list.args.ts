import { ArgsType, Field } from 'type-graphql';
import { IsOptional, IsPositive } from 'class-validator';

@ArgsType()
export class QueryListArgs {
  @Field({nullable: true})
  @IsOptional()
  @IsPositive()
  pageIndex: number = 1;

  @Field({nullable: true})
  @IsOptional()
  @IsPositive()
  pageSize: number = 10;
}
