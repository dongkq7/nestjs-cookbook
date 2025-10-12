import { Module } from '@nestjs/common';
import { UserAclService } from './user-acl.service';
import { UserAclController } from './user-acl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [
    /**
     * 提前创建好数据库：
     * CREATE DATABASE acl_test DEFAULT CHARACTER SET utf8mb4;
     */
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'acl_test',
      synchronize: true,
      logging: true,
      entities: [User, Permission],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
  ],
  controllers: [UserAclController],
  providers: [UserAclService],
  // permission.guard中要使用，所以导出
  exports: [UserAclService],
})
export class UserAclModule {}
