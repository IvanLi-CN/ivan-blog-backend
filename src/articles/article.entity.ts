import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import {User} from '../users/user.entity';
import {Tag} from '../tags/tag.entity';
import {Comment} from '../comments/comment.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 255, comment: "文章标题"})
  title: string;

  @Column({length: 177, unique: true, comment: "文章链接"})
  slug: string;

  @Column({length: 1000, comment: "文章摘要"})
  summary: string;

  @Column({length: 20000, comment: "文章内容"})
  content: string;

  @ManyToOne(() => User, author => author.articles)
  author: User;

  @Column({nullable: false})
  authorId: number;

  @ManyToMany(() => Tag, tag => tag.articles)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Comment, comment => comment.article)
  comments: Comment[];

  @Column({type: 'int', comment: "顶", default: 0})
  ups: number;

  @Column({type: 'int', comment: "踩", default: 0})
  downs: number;

  @Column({type: 'int', comment: "浏览量", default: 0})
  views: number;

  @Column({comment: "可否评论", default: true})
  commentable: boolean;

  @Column({default: false})
  isDel: boolean;

  @Column({comment: "可否公开", default: true})
  isPublic: boolean;

  @Column({type: 'datetime', comment: "发布时间"})
  publishedAt: Date;
  @CreateDateColumn({select: false})
  createdAt: Date;
  @UpdateDateColumn({select: false})
  updatedAt: Date;
}
