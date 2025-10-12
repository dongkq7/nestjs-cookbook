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

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'hello world',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    FileUploadModule,
    UserLoginModule,
    UserAclModule,
    RedisModule,
    UserRbacModule,
    LoginRefreshModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
