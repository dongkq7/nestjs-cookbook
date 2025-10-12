import { LoginUserDto } from './dto/login-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class UserAclService {
  @InjectEntityManager()
  entityManager: EntityManager;

  async initData() {
    const p1 = new Permission();
    p1.name = 'create_a';
    p1.desc = '新增a';

    const p2 = new Permission();
    p2.name = 'update_a';
    p2.desc = '修改a';

    const p3 = new Permission();
    p3.name = 'remove_a';
    p3.desc = '删除a';

    const p4 = new Permission();
    p4.name = 'query_a';
    p4.desc = '查询a';

    const p5 = new Permission();
    p5.name = 'create_b';
    p5.desc = '新增b';

    const p6 = new Permission();
    p6.name = 'update_b';
    p6.desc = '修改b';

    const p7 = new Permission();
    p7.name = 'remove_b';
    p7.desc = '删除b';

    const p8 = new Permission();
    p8.name = 'query_b';
    p8.desc = '查询b';

    const u1 = new User();
    u1.username = '张三';
    u1.password = '123';
    u1.permissions = [p1, p2, p3, p4];

    const u2 = new User();
    u2.username = '李四';
    u2.password = '456';
    u2.permissions = [p5, p6, p7, p8];

    await this.entityManager.save([p1, p2, p3, p4, p5, p6, p7, p8]);
    await this.entityManager.save([u1, u2]);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.entityManager.findOneBy(User, {
      username: loginUserDto.username,
    });

    if (!user) {
      throw new HttpException('该用户不存在', HttpStatus.ACCEPTED);
    }

    if (user.password !== loginUserDto.password) {
      throw new HttpException('密码错误', HttpStatus.ACCEPTED);
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.entityManager.findOne(User, {
      where: {
        username,
      },
      relations: {
        permissions: true,
      },
    });
    return user;
  }
}
