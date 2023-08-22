import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    nullable: true,
  })
  categoryId: number | null;

  @Column({
    length: 1024,
    nullable: true,
  })
  articleCover: string | null;

  @Column({
    length: 50,
  })
  articleTitle: string;

  @Column()
  articleContent: string;

  @Column({
    default: false,
  })
  isTop: boolean;

  @Column({
    default: false,
  })
  isFeatured: boolean;

  @Column({
    default: false,
  })
  isDelete: boolean;

  // 1: 公开, 2: 私密, 3: 草稿
  @Column({
    default: 1,
  })
  status: number;

  // 1: 原创, 2: 转载, 3: 翻译
  @Column({
    default: 1,
  })
  type: number;

  @Column({
    nullable: true,
    length: 255,
  })
  password: string | null;

  @Column({
    nullable: true,
    length: 255,
  })
  originalUrl: string | null;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
