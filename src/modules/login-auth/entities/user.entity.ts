import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RegisterType {
  normal = 1,
  google = 2,
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  email: string;

  @Column({
    length: 20,
  })
  password: string;

  @Column({
    comment: '昵称',
    length: 50,
  })
  nickName: string;

  @Column({
    comment: '头像',
    length: 200,
  })
  avatar: string;

  @Column({
    comment: '注册类型: 1.用户名密码注册 2. google自动注册',
    default: 1,
  })
  registerType: RegisterType;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
