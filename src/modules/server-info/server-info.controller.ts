import { ServerInfoService } from './server-info.service';
import { Controller, Get } from '@nestjs/common';

@Controller('server-info')
export class ServerInfoController {
  constructor(private serverInfoService: ServerInfoService) {}

  @Get('')
  async serverInfo() {
    return await this.serverInfoService.getServerInfo();
  }
}
