import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserAclService } from './user-acl.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserAclService)
  private userService: UserAclService;

  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user = request.session.user;
    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }
    // 先从缓存里取
    let permissions = await this.redisService.listGet(
      `user_${user.username}_permissions`,
    );
    if (!permissions.length) {
      const foundUser = await this.userService.findByUsername(user.username);
      permissions = foundUser!.permissions.map((item) => item.name);

      void this.redisService.listSet(
        `user_${user.username}_permissions`,
        permissions,
        60 * 30,
      );
    }
    const permission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (permissions.some((item) => item === permission)) {
      return true;
    } else {
      throw new UnauthorizedException('您没有权限访问该接口');
    }
  }
}
