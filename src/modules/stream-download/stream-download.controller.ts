import { Controller, Get, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';

@Controller('stream-download')
export class StreamDownloadController {
  @Get('')
  download() {
    const stream = createReadStream('package.json');

    return new StreamableFile(stream, {
      type: 'text/plain',
      disposition: `attachment; filename="test.json"`,
    });
  }
}
