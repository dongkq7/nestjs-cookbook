import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

// 扩展下Session中的数据类型
declare module 'express-session' {
  // 利用同名interface会自动合并的特性来扩展Session
  interface Session {
    user: {
      username: string;
    };
  }
}

/**
 * 登录校验守卫，采用session的方式
 */
@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.session?.user) {
      throw new UnauthorizedException('用户未登录');
    }
    return true;
  }
}
