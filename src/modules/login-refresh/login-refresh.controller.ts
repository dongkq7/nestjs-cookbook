import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginRefreshService } from './login-refresh.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginGuard } from './login.guard';

@Controller('login-refresh')
export class LoginRefreshController {
  constructor(private readonly loginRefreshService: LoginRefreshService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    const user = await this.loginRefreshService.login(loginUser);

    const access_token = this.jwtService.sign(
      {
        id: user.id,
        username: user.username,
      },
      {
        expiresIn: '30m',
      },
    );

    const refresh_token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '7d',
      },
    );
    return {
      access_token,
      refresh_token,
    };
  }

  // 刷新token
  @Get('refresh')
  async refresh(@Query('refresh_token') refreshToken: string) {
    try {
      const data = this.jwtService.verify<{ id: number }>(refreshToken);
      const user = await this.loginRefreshService.findUserById(data.id);
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.OK);
      }
      // 刷新token
      const access_token = this.jwtService.sign(
        {
          id: user.id,
          username: user.username,
        },
        {
          expiresIn: '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          id: user.id,
        },
        {
          expiresIn: '7d',
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch {
      throw new UnauthorizedException('登录失效，请重新登录');
    }
  }

  @Get('test')
  @UseGuards(LoginGuard)
  test() {
    return 'test';
  }
}
