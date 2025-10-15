import { Module } from '@nestjs/common';
import { StreamDownloadController } from './stream-download.controller';

@Module({
  controllers: [StreamDownloadController]
})
export class StreamDownloadModule {}
