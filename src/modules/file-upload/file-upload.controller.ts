import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { statSync } from 'fs';

const UPLOAD_DIR = 'src/modules/file-upload/uploads';
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  /**
   * 文件分片上传
   * @param files
   * @param body
   */
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: UPLOAD_DIR,
    }),
  )
  uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { fileName: string },
  ) {
    console.log('body', body);

    if (!files || !files.length) {
      throw new BadRequestException('请上传文件');
    }

    const file = files[0];
    if (!file?.path) {
      throw new BadRequestException('文件路径无效');
    }
    const fileName = body.fileName?.match(/(.+)-\d+$/)?.[1] ?? null;
    if (!fileName) {
      throw new BadRequestException('文件名称格式不正确');
    }
    const chunkDir = `${UPLOAD_DIR}/chunks_${fileName}`;

    try {
      if (!fs.existsSync(chunkDir)) {
        fs.mkdirSync(chunkDir);
      }

      const targetPath = path.join(chunkDir, body.fileName);
      fs.cpSync(file.path, targetPath);

      if (fs.existsSync(file.path)) {
        fs.rmSync(file.path);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '文件处理失败';
      throw new InternalServerErrorException(`文件处理失败: ${errorMessage}`);
    }
  }

  @Get('merge')
  merge(@Query('fileName') fileName: string) {
    const chunkDir = `${UPLOAD_DIR}/chunks_${fileName}`;
    if (!fs.existsSync(chunkDir)) {
      throw new BadRequestException('文件不存在');
    }

    // 读取出所有文件分片
    const files = fs.readdirSync(chunkDir);

    let count = 0; // 写入完毕的分片数量
    let startPos = 0;
    files.map((file) => {
      const filePath = chunkDir + '/' + file;
      const stream = fs.createReadStream(filePath);
      // 写入指定位置
      stream
        .pipe(
          fs.createWriteStream(`${UPLOAD_DIR}/${fileName}`, {
            start: startPos,
          }),
        )
        .on('finish', () => {
          count++;
          // 如果全部分片写入完毕，则删除存储分片的目录
          if (count === files.length) {
            fs.rm(
              chunkDir,
              {
                recursive: true,
              },
              () => {},
            );
          }
        });

      const fsStat = statSync(filePath);
      startPos += fsStat.size;
    });
  }
}
