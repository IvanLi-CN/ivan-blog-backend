import { Field, ObjectType } from 'type-graphql';
import { AccountTypes } from '../../core/auth/account-types.enum';

@ObjectType()
export class AccountInfoDto {
  @Field()
  id: number;
  @Field()
  account: string;
  @Field()
  nick: string;
  @Field()
  role: AccountTypes;
}
