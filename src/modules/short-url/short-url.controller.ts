import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Redirect,
} from '@nestjs/common';
import { ShortLongMapService } from './short-long-map.service';

@Controller('short-url')
export class ShortUrlController {
  @Inject()
  private shortLongMapService: ShortLongMapService;

  @Get('')
  async generateShortUrl(@Query('url') longUrl: string) {
    return this.shortLongMapService.generate(longUrl);
  }

  @Get(':code')
  @Redirect()
  async jump(@Param('code') code: string) {
    const longUrl = await this.shortLongMapService.getLongUrl(code);
    if (!longUrl) {
      throw new BadRequestException('短链不存在');
    }
    return {
      statusCode: 302,
      url: longUrl,
    };
  }
}
