import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
  })
  name: string;

  @Column({
    length: 50,
    nullable: true,
  })
  path: string | null;

  @Column({
    length: 50,
    nullable: true,
  })
  icon: string | null;

  @Column()
  orderNum: number;

  @Column({
    nullable: true,
  })
  parentId: number | null;

  @Column({
    default: false,
  })
  isHidden: boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
