import { Module } from '@nestjs/common';
import { PptGenerateController } from './ppt-generate.controller';
import { PptGenerateService } from './ppt-generate.service';

@Module({
  controllers: [PptGenerateController],
  providers: [PptGenerateService]
})
export class PptGenerateModule {}
