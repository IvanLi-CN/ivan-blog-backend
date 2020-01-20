import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { SystemRoles } from '../core/auth/account-types.enum';
import { Article } from '../articles/article.entity';
import { AppBaseEntity } from '../common/entities/app-base-entity';

@ObjectType()
@Entity()
export class Account extends AppBaseEntity {
  @Field()
  @Index({ unique: true })
  @Column({ type: 'char', length: 32, comment: '账号' })
  account: string;

  @Field()
  @Index()
  @Column({ type: 'char', length: 32, comment: '昵称' })
  nick: string;

  @Column({ type: 'char', length: 128, comment: '密码', select: false })
  password: string;

  @Column({ default: false, select: false })
  isDelete: boolean;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ type: 'enum', enum: SystemRoles, comment: '系统角色', default: SystemRoles.member})
  systemRole: SystemRoles;

  @OneToMany(type => Article, article => article.author)
  articles: Article[];
}
