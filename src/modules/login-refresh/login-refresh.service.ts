import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class LoginRefreshService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async login(loginUser: LoginUserDto) {
    const user = await this.entityManager.findOne(User, {
      where: {
        username: loginUser.username,
      },
    });

    if (!user) {
      throw new HttpException('该用户不存在', HttpStatus.OK);
    }

    if (user.password !== loginUser.password) {
      throw new HttpException('密码错误', HttpStatus.OK);
    }

    return user;
  }

  async findUserById(id: number) {
    return await this.entityManager.findOne(User, {
      where: {
        id,
      },
    });
  }
}
