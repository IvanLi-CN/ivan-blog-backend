import { Field, InputType } from '@nestjs/graphql';
import { Length, IsOptional } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { Account } from '../account.entity';

@InputType()
export class UpdateAccountInput implements DeepPartial<Account> {
  @Field({nullable: true})
  @IsOptional()
  @Length(4, 32)
  account?: string;
  @Field({nullable: true})
  @IsOptional()
  @Length(6, 16)
  password?: string;
  @Field({nullable: true})
  @IsOptional()
  @Length(2, 16)
  nick?: string;
}
