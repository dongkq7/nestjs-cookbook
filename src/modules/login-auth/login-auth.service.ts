import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
const githubUsers = [
  {
    githubId: '70085684',
    username: 'ddd',
  },
  {
    githubId: '2',
    username: 'kkk',
  },
  {
    githubId: '3',
    username: 'qqq',
  },
];

export interface GoogleInfo {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}
@Injectable()
export class LoginAuthService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @Inject()
  private userService: UserService;

  // 通过谷歌认证登录-注册用户信息到数据库表中
  async registerByGoogleInfo(info: GoogleInfo) {
    const user = new User();

    user.nickName = `${info.firstName}_${info.lastName}`;
    user.avatar = info.picture;
    user.email = info.email;
    user.password = '';
    user.registerType = 2;

    return this.entityManager.save(User, user);
  }

  async findGoogleUserByEmail(email: string) {
    return this.entityManager.findOneBy(User, {
      registerType: 2,
      email,
    });
  }

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('该用户不存在');
    }
    if (user.password !== pass) {
      throw new UnauthorizedException('密码错误');
    }

    const { password, ...result } = user;
    return result;
  }

  findUserByGithubId(id: string) {
    return githubUsers.find((item) => item.githubId === id);
  }
}
