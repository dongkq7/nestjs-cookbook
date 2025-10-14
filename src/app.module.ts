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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
