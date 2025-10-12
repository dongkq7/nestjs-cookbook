import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRbacService } from './user-rbac.service';
import { Request } from 'express';
import { Permission } from './entities/permission.entity';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserRbacService)
  private userService: UserRbacService;

  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.userRbac) {
      return true;
    }

    const user = request.userRbac;

    // 从缓存里取
    let permissions = await this.redisService.listGet(
      `user_${user.username}_roles_permissions`,
    );

    if (!permissions.length) {
      const roles = await this.userService.findRolesByIds(
        user.roles.map((item) => item.id),
      );

      permissions = roles
        .reduce((total: Permission[], current) => {
          total.push(...current.permissions);
          return total;
        }, [])
        .map((item) => item.name);

      void this.redisService.listSet(
        `user_${user.username}_roles_permissions`,
        permissions,
        60 * 30,
      );
    }

    const requirePermissions = this.reflector.getAllAndOverride<string[]>(
      'require_permission',
      [context.getClass(), context.getHandler()],
    );

    for (let i = 0; i < requirePermissions.length; i++) {
      const cur = requirePermissions[i];
      const found = permissions.find((item) => item === cur);
      if (!found) {
        throw new UnauthorizedException('您没有权限访问该接口');
      }
    }
    return true;
  }
}
