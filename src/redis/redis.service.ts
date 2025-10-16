import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async listGet(key: string) {
    return await this.redisClient.lRange(key, 0, -1);
  }

  async listSet(key: string, list: Array<string>, ttl?: number) {
    for (let i = 0; i < list.length; i++) {
      await this.redisClient.lPush(key, list[i]);
    }
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async hashGet<T = any>(key: string): Promise<T | null> {
    const result = await this.redisClient.hGetAll(key);
    if (!Object.keys(result).length) {
      return null;
    }
    return result as T;
  }

  async hashSet<T extends Record<string, any>>(
    key: string,
    data: T,
    ttl?: number,
  ) {
    for (const [name, value] of Object.entries(data)) {
      await this.redisClient.hSet(key, name, value);
    }

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
}
