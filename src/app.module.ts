import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { UserLoginModule } from './modules/user-login/user-login.module';

@Module({
  imports: [FileUploadModule, UserLoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
