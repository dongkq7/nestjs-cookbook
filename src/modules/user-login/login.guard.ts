import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

/**
 * 守卫
 * 实现jwt校验逻辑
 */
@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.header('authorization') || '';
    const bearer = authorization.split(' ');
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('授权失败');
    }
    const token = bearer[1];

    try {
      const info = this.jwtService.verify(token) as unknown as {
        user: { id: number; username: string };
      };
      request.user = info.user;
      return true;
    } catch {
      throw new UnauthorizedException('登录失效，请重新登录');
    }
  }
}
