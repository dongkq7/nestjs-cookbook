import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { existsSync } from 'fs';
import * as sharp from 'sharp';

@Controller('img-compress')
export class ImgCompressController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return file.path;
  }

  @Get('')
  async compress(
    @Query('path') filePath: string,
    @Query('color', ParseIntPipe) color: number,
    @Res() res: Response,
  ) {
    console.log(filePath, color);
    if (!existsSync(filePath)) {
      throw new BadRequestException('抱歉，文件不存在');
    }

    const data = await sharp(filePath, {
      animated: true, // 读取所有帧，如果设置为false则读取第一针
      limitInputPixels: false, // 不限制图片大小，如果这是为true那么图片过大则会失败
    })
      .gif({
        colors: color, // 颜色数量，默认为256，值越大图片色彩越丰富
      })
      .toBuffer();

    res.set('Content-Disposition', `attachment; filename="dest.gif"`);
    return res.send(data);
  }
}
