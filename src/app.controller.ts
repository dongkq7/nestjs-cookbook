import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './modules/user-login/login.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * 验证登录
   */
  @Get('testLogin')
  @UseGuards(LoginGuard)
  aaa() {
    return 'aaa';
  }
}
