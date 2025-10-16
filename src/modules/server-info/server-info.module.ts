import { Module } from '@nestjs/common';
import { ServerInfoService } from './server-info.service';
import { ServerInfoController } from './server-info.controller';

@Module({
  providers: [ServerInfoService],
  controllers: [ServerInfoController]
})
export class ServerInfoModule {}
