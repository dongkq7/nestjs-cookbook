import { Controller, Sse } from '@nestjs/common';
import { PptGenerateService } from './ppt-generate.service';

@Controller('ppt-generate')
export class PptGenerateController {
  constructor(private service: PptGenerateService) {}

  @Sse('')
  universityList() {
    return this.service.getUniversityData();
  }
}
