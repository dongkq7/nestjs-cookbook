import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserRbacService } from './user-rbac.service';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin, RequirePermission } from './custom.decorator';

@Controller('user-rbac')
export class UserRbacController {
  constructor(private readonly userRbacService: UserRbacService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Get('init')
  async initData() {
    await this.userRbacService.initData();
    return 'done';
  }

  @Post('login')
  async login(@Body() loginUser: UserLoginDto) {
    const user = await this.userRbacService.login(loginUser);
    const token = this.jwtService.sign({
      user: {
        username: user.username,
        roles: user.roles,
      },
    });

    return {
      token,
    };
  }

  @Get('aaa')
  @RequireLogin()
  @RequirePermission('create_aaa', 'query_aaa')
  aaa() {
    return 'aaa';
  }
}
