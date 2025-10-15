import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { generateRandomStr } from './utils';
import { UniqueCode } from './entities/unique-code.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UniqueCodeService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  // @Cron(CronExpression.EVERY_5_SECONDS)
  async generateCode(): Promise<UniqueCode> {
    const str = generateRandomStr(6);

    const uniqueCode = await this.entityManager.findOneBy(UniqueCode, {
      code: str,
    });

    // 如果数据库中没有找到相同的则可以使用
    if (!uniqueCode) {
      const code = new UniqueCode();
      code.code = str;
      code.status = 0;
      await this.entityManager.insert(UniqueCode, code);

      return code;
    } else {
      // 否则重新生成
      return this.generateCode();
    }
  }

  // 每天凌晨四点批量生成
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async batchGenerateCode() {
    // 可以优化成一次插入20条这样
    for (let i = 0; i < 1000; i++) {
      await this.generateCode();
    }
  }
}
