import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  })
  path: string;

  @Column({
    length: 50,
  })
  icon: string;

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

  children: Menu[];
}
