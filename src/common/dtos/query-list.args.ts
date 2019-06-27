import { ArgsType, Field, Int } from 'type-graphql';
import { IsOptional, IsPositive } from 'class-validator';

@ArgsType()
export class QueryListArgs {
  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsPositive()
  pageIndex: number = 1;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsPositive()
  pageSize: number = 10;
}
