import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Article} from '../articles/article.entity';
import {Comment} from '../comments/comment.entity';
import {LoggedUserGroups} from "../core/auth/enums/LoggedUserGroups";

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, unique: true, comment: '用户名'})
  name: string;

  @Column({ length: 64, unique: true, comment: '电邮地址' })
  email: string;

  @Column({ length: 128, select: false })
  password: string;

  @Column({type: 'char', length: 100, nullable: true, select: false })
  token: string;

  @Column({default: false, select: false })
  isDel: boolean;

  @OneToMany(() => Article, article => article.author)
  articles: Article[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @Column({type: 'enum', enum: LoggedUserGroups, default: LoggedUserGroups.member})
  group: LoggedUserGroups;

  @CreateDateColumn({select: false })
  createdAt: Date;
  @UpdateDateColumn({select: false })
  publishedAt: Date;
}
