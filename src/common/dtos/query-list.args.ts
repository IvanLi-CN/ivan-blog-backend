import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive, IsIn } from 'class-validator';
import { OrderByCondition } from 'typeorm';

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

  @Field(type => String, {nullable: true})
  @IsOptional()
  @IsIn(['DESC', 'ASC'])
  createdAtOrderBy?: OrderByCondition;
}
