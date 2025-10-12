import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';

function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

@Injectable()
export class UserLoginService {
  private logger = new Logger();
  /**
   * 使用之前要在user-login.module模块中引入：
   * TypeOrmModule.forFeature([User]),
   */
  @InjectRepository(User)
  private userRepository: Repository<User>;

  // 用户注册
  async register(user: RegisterDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new HttpException('该用户已存在', HttpStatus.OK);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);

    try {
      await this.userRepository.save(newUser);
    } catch (e) {
      this.logger.error(e, UserLoginService);
      return '注册失败';
    }
  }

  // 用户登录
  async login(user: LoginDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.OK);
    }

    if (foundUser.password !== md5(user.password)) {
      throw new HttpException('用户名或密码错误', HttpStatus.OK);
    }
    return foundUser;
  }
}
