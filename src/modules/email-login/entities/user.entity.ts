import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 生成表之后插入一条数据方便测试进行邮件的发送：
 * INSERT INTO `email_login`.`user` 
  (`id`, `username`, `password`, `email`) 
  VALUES ('1', 'test', '123456', '你的邮箱地址xx.xx@qq.com');
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @Column({
    length: 50,
    comment: '邮箱地址',
  })
  email: string;
}
