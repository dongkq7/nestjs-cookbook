import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniqueCode } from './entities/unique-code.entity';
import { UniqueCodeService } from './unique-code.service';
import { ShortUrlController } from './short-url.controller';
import { ShortLongMap } from './entities/sort-long-map.entity';
import { ShortLongMapService } from './short-long-map.service';

@Module({
  imports: [
    /**
     * CREATE DATABASE short_url DEFAULT CHARACTER SET utf8mb4;
     */
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'short_url',
      synchronize: true,
      logging: true,
      entities: [UniqueCode, ShortLongMap],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
  ],
  providers: [UniqueCodeService, ShortLongMapService],
  controllers: [ShortUrlController],
  // exports: [UniqueCodeService],
})
export class ShortUrlModule {}
