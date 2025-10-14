import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager } from '@nestjs/typeorm';
import { createTransport, Transporter } from 'nodemailer';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class EmailLoginService {
  private transporter: Transporter;
  @InjectEntityManager()
  private entityManage: EntityManager;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('email_user'), // 你的邮箱地址
        pass: this.configService.get('email_password'), // 你的授权码 如何获取？搜索qq邮箱授权码获取
      },
    });
  }

  async sendMail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    await this.transporter.sendMail({
      from: {
        name: '测试',
        address: this.configService.get('email_user') as string,
      },
      to,
      subject,
      html,
    });
  }

  async findUserByEmail(email: string) {
    return await this.entityManage.findOneBy(User, {
      email,
    });
  }
}
