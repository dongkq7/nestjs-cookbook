import { Module } from '@nestjs/common';
import { QrcodeLoginController } from './qrcode-login.controller';
import { QrcodeLoginService } from './qrcode-login.service';

@Module({
  controllers: [QrcodeLoginController],
  providers: [QrcodeLoginService],
})
export class QrcodeLoginModule {}
