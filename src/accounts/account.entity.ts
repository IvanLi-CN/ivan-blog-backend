import { Column, Entity, Index } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity } from '../common/entities/base.entity';
import { AccountTypes } from '../core/auth/account-types.enum';

@ObjectType()
@Entity()
export class Account extends BaseEntity {
  @Field()
  @Index({ unique: true })
  @Column({ type: 'char', length: 32, comment: '账号' })
  account: string;

  @Field()
  @Index()
  @Column({ type: 'char', length: 32, comment: '昵称' })
  nick: string;

  @Column({ type: 'char', length: 128, comment: '密码' })
  password: string;

  @Column({ default: false })
  isDelete: boolean;

  @Column({ type: 'enum', enum: AccountTypes, comment: '角色', default: AccountTypes.member})
  role: AccountTypes;
}
