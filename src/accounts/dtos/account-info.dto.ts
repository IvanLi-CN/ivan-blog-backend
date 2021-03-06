import { Field, ObjectType } from '@nestjs/graphql';
import { SystemRoles } from '../../core/auth/account-types.enum';

@ObjectType()
export class AccountInfoDto {
  @Field()
  id: string;
  @Field()
  account: string;
  @Field()
  nick: string;
  @Field()
  systemRole: SystemRoles;
}
