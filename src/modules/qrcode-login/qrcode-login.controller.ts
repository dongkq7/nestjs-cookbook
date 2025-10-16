import { User } from './../user-rbac/entities/user.entity';
import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as qrcode from 'qrcode';
import { RedisService } from 'src/redis/redis.service';

// no-scan 未扫描
// scan-wait-confirm -已扫描，等待用户确认
// scan-confirm 已扫描，用户同意授权
// scan-cancel 已扫描，用户取消授权
// expired 已过期
interface QrCodeInfo {
  status:
    | 'no-scan'
    | 'scan-wait-confirm'
    | 'scan-confirm'
    | 'scan-cancel'
    | 'expired';
  userInfo?: string;
}

@Controller('qrcode-login')
export class QrcodeLoginController {
  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  // 假装是保存在数据库中的用户信息
  private users = [
    { id: 1, username: 'zhangsan', password: '111111' },
    { id: 2, username: 'lisi', password: '222222' },
  ];

  // 登录
  @Get('')
  login(
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    const user = this.users.find((item) => item.username === username);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    if (user.password !== password) {
      throw new UnauthorizedException('密码错误');
    }

    return {
      token: this.jwtService.sign({
        userId: user.id,
      }),
    };
  }

  // 获取用户信息
  @Get('user')
  userInfo(@Headers('Authorization') auth: string) {
    try {
      const [, token] = auth.split(' ');
      const userInfo = this.jwtService.verify<{ userId: number }>(token);
      const user = this.users.find((item) => item.id === userInfo.userId);
      return user;
    } catch {
      throw new UnauthorizedException('登录失效');
    }
  }

  // 生成二维码
  @Get('generate')
  async generate() {
    const uuid = randomUUID();

    const dataUrl = await qrcode.toDataURL(
      `http://192.168.10.109:3000/pages/confirm.html?id=${uuid}`, // 这里的IP需要换成您的IP
    );

    await this.redisService.hashSet<QrCodeInfo>(
      `qrcode-${uuid}`,
      {
        status: 'no-scan',
      },
      5 * 60,
    );
    return {
      qrcode_id: uuid,
      img: dataUrl,
    };
  }

  // 二维码查询接口
  @Get('check')
  async check(@Query('id') id: string) {
    const info = await this.redisService.hashGet<QrCodeInfo>(`qrcode-${id}`);

    // 如果是确认登录状态，就把token带过去
    if (info?.status === 'scan-confirm') {
      let userInfo: { userId: number; userName: string } | undefined =
        undefined;
      if (info.userInfo) {
        userInfo = JSON.parse(info.userInfo) as {
          userId: number;
          userName: string;
        };
      }
      return {
        token: this.jwtService.sign({
          userId: userInfo?.userId,
        }),
        ...info,
        ...userInfo,
      };
    }
    return info;
  }

  // 扫描二维码
  @Get('scan')
  async scan(@Query('id') id: string) {
    const info = await this.redisService.hashGet<QrCodeInfo>(`qrcode-${id}`);

    if (!info) {
      throw new BadRequestException('二维码已失效');
    }

    info.status = 'scan-wait-confirm';

    await this.redisService.hashSet(`qrcode-${id}`, info);
    return 'success';
  }

  // 二维码确认
  @Get('confirm')
  async confirm(
    @Query('id') id: string,
    @Headers('Authorization') auth: string,
  ) {
    let user: { id: number; username: string; password: string } | null = null;
    try {
      const [, token] = auth.split(' ');
      const userInfo = this.jwtService.verify<{ userId: number }>(token);
      user = this.users.find((item) => item.id === userInfo.userId)!;
    } catch {
      throw new UnauthorizedException('登录失效，请重新登录');
    }
    const info = await this.redisService.hashGet<QrCodeInfo>(`qrcode-${id}`);

    if (!info) {
      throw new BadRequestException('二维码已失效');
    }

    info.status = 'scan-confirm';
    info.userInfo = JSON.stringify({
      userId: user.id,
      userName: user.username,
    });

    await this.redisService.hashSet(`qrcode-${id}`, info);
    return 'success';
  }

  // 取消
  @Get('cancel')
  async cancel(@Query('id') id: string) {
    const info = await this.redisService.hashGet<QrCodeInfo>(`qrcode-${id}`);

    if (!info) {
      throw new BadRequestException('二维码已失效');
    }

    info.status = 'scan-cancel';
    await this.redisService.hashSet(`qrcode-${id}`, info);
    return 'success';
  }
}
