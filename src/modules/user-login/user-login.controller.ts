import {
  Body,
  Controller,
  Inject,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { UserLoginService } from './user-login.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('user-login')
export class UserLoginController {
  constructor(private readonly userLoginService: UserLoginService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  // 用户注册
  @Post('register')
  async register(@Body(ValidationPipe) user: RegisterDto) {
    return await this.userLoginService.register(user);
  }

  // 用户登录
  @Post('login')
  async login(
    @Body(ValidationPipe) user: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const foundUser = await this.userLoginService.login(user);

    if (foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          username: foundUser.username,
        },
      });
      res.setHeader('Authorization', token);
      return 'login success';
    } else {
      return 'login fail';
    }
  }
}
