import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { UserLoginModule } from './modules/user-login/user-login.module';
import { UserAclModule } from './modules/user-acl/user-acl.module';
import { RedisModule } from './redis/redis.module';
import { UserRbacModule } from './modules/user-rbac/user-rbac.module';
import { JwtModule } from '@nestjs/jwt';
import { LoginRefreshModule } from './modules/login-refresh/login-refresh.module';
import { LoginAuthModule } from './modules/login-auth/login-auth.module';
import { UserModule } from './user/user.module';
import { EmailLoginModule } from './modules/email-login/email-login.module';
import { ConfigModule } from '@nestjs/config';
import { ShortUrlModule } from './modules/short-url/short-url.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ImgCompressModule } from './modules/img-compress/img-compress.module';
import { StreamDownloadModule } from './modules/stream-download/stream-download.module';
import { QrcodeLoginModule } from './modules/qrcode-login/qrcode-login.module';
import { PptGenerateModule } from './modules/ppt-generate/ppt-generate.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    JwtModule.register({
      global: true,
      secret: 'hello world',
      signOptions: {
        expiresIn: '0.5h',
      },
    }),
    FileUploadModule,
    UserLoginModule,
    UserAclModule,
    RedisModule,
    UserRbacModule,
    LoginRefreshModule,
    LoginAuthModule,
    UserModule,
    EmailLoginModule,
    ShortUrlModule,
    ImgCompressModule,
    StreamDownloadModule,
    QrcodeLoginModule,
    PptGenerateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
