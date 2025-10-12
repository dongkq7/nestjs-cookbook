import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { UserAclService } from './user-acl.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Session as ExpressSession } from 'express-session';

@Controller('user-acl')
export class UserAclController {
  constructor(private readonly userAclService: UserAclService) {}

  // 初始化表数据
  @Get('init')
  async initData() {
    await this.userAclService.initData();
    return 'done';
  }

  // 这里使用session+cookie的方式
  @Post('login')
  async login(
    @Body() loginUser: LoginUserDto,
    @Session() session: ExpressSession,
  ) {
    const user = await this.userAclService.login(loginUser);

    session.user = {
      username: user.username,
    };
    return 'success';
  }
}
