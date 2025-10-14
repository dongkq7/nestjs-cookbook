import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailLoginService } from './email-login.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('email-login')
export class EmailLoginController {
  constructor(private readonly emailLoginService: EmailLoginService) {}

  @Inject()
  private redisService: RedisService;
  @Inject(JwtService)
  private jwtService: JwtService;

  @Get('code')
  async sendEmailForCode(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    // 存储到redis中
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    // 发送验证码到邮箱
    await this.emailLoginService.sendMail({
      to: address,
      subject: '登录验证码',
      html: `<p>您登录的验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, code } = loginUserDto;
    const codeInRedis = await this.redisService.get(`captcha_${email}`);

    if (!codeInRedis) {
      throw new UnauthorizedException('验证码失效');
    }

    if (code !== codeInRedis) {
      throw new UnauthorizedException('验证码不正确');
    }

    const user = await this.emailLoginService.findUserByEmail(email);
    console.log(user);
    const token = this.jwtService.sign({
      user: {
        id: user?.id,
        email: user?.email,
      },
    });
    response.setHeader('Authorization', token);
    return 'success';
  }
}
