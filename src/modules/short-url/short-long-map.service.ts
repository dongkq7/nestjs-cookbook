import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UniqueCodeService } from './unique-code.service';
import { EntityManager } from 'typeorm';
import { UniqueCode } from './entities/unique-code.entity';
import { ShortLongMap } from './entities/sort-long-map.entity';

@Injectable()
export class ShortLongMapService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @Inject(UniqueCodeService)
  private uniqueCodeService: UniqueCodeService;

  // 根据url生成短链
  async generate(longUrl: string) {
    // 找到未使用的压缩码
    let uniqueCode = await this.entityManager.findOneBy<UniqueCode>(
      UniqueCode,
      {
        status: 0,
      },
    );

    // 如果没有未使用的则去生成
    if (!uniqueCode) {
      uniqueCode = await this.uniqueCodeService.generateCode();
    }

    const map = new ShortLongMap();
    map.shortUrl = uniqueCode.code;
    map.longUrl = longUrl;
    await this.entityManager.insert(ShortLongMap, map);
    await this.entityManager.update(
      UniqueCode,
      {
        id: uniqueCode.id,
      },
      {
        status: 1,
      },
    );

    return uniqueCode.code;
  }

  async getLongUrl(code: string) {
    const map = await this.entityManager.findOneBy(ShortLongMap, {
      shortUrl: code,
    });

    if (!map) {
      return null;
    }

    return map.longUrl;
  }
}
