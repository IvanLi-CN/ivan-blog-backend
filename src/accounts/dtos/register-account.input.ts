import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { Account } from '../account.entity';

@InputType()
export class RegisterAccountInput implements DeepPartial<Account> {
  @Field()
  @Length(4, 32)
  account: string;
  @Field()
  @Length(6, 16)
  password: string;
  @Field()
  @Length(2, 16)
  nick: string;
}
