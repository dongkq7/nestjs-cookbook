import { Module } from '@nestjs/common';
import { ImgCompressController } from './img-compress.controller';

@Module({
  controllers: [ImgCompressController],
})
export class ImgCompressModule {}
