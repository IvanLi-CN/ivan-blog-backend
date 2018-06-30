import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import {Article} from '../articles/article.entity';

@Entity()
export class Tag {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 24, comment: '名称'})
  name: string;

  @Column({length: 32, unique: true, comment: '链接名'})
  slug: string;

  @OneToOne(() => Article)
  @JoinColumn()
  detail: Article;


  @ManyToOne(() => Tag, tag => tag.children)
  parent: Tag;

  @Column({nullable: true, select: false})
  parentId: number;

  @OneToMany(() => Tag, tag => tag.parent)
  children: Tag[];


  @ManyToMany(() => Article, article => article.tags)
  articles: Article[];

  @CreateDateColumn({select: false})
  createdAt: Date;
  @UpdateDateColumn({select: false})
  updatedAt: Date;
}
