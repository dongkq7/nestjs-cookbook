import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './modules/user-login/login.guard';
import { LoginGuard as LoginGuardAcl } from './modules/user-acl/login.guard';
import { PermissionGuard } from './modules/user-acl/permission.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * 验证登录
   * 1. 访问localhost:3000/user-login/login来进行登录，拿到token
   * 2. 通过该接口进行验证：postman中调取接口并设置上请求头：Authorization:Bearer xxxx
   */
  @Get('testLogin')
  @UseGuards(LoginGuard)
  aaa() {
    return 'aaa';
  }

  /**
   * 验证登录2
   * 1. 访问localhost:3000/user-acl/login来进行登录
   * 2. 将接口响应头中的cookie复制，放到postman Cookies中进行访问
   */
  @Get('testLogin2')
  @UseGuards(LoginGuardAcl)
  bbb() {
    return 'bbb';
  }

  /**
   * 验证权限
   */
  @Get('testAcl')
  @SetMetadata('permission', 'query_a')
  @UseGuards(LoginGuardAcl, PermissionGuard)
  ccc() {
    return 'ccc';
  }
}
