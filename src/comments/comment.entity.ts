import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import {Article} from '../articles/article.entity';
import {User} from '../users/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, article => article.comments,  {nullable: false})
  article: Article;

  @Column({nullable: false})
  articleId: number;


  @ManyToOne(() => Comment, comment => comment.children)
  parent: Comment;

  @OneToMany(() => Comment, comment => comment.parent)
  children: Comment[];

  @Column({length: 1000, comment: '评论内容'})
  content: string;

  @ManyToOne(() => User, user => user.comments)
  author: User;

  @Column({nullable: true})
  authorId: number;

  @Column({default: false})
  isDel: boolean;

  @Column({comment: '是否通过审核', default: false})
  public: boolean;

  @CreateDateColumn({select: false})
  createdAt: Date;
  @UpdateDateColumn({select: false})
  updatedAt: Date;
}
