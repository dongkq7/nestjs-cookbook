import { Module } from '@nestjs/common';
import { UserRbacService } from './user-rbac.service';
import { UserRbacController } from './user-rbac.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard';
import { PermissionGuard } from './permission.guard';

@Module({
  imports: [
    /**
     * CREATE DATABASE rbac_test DEFAULT CHARACTER SET utf8mb4;
     */
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '123456',
    //   database: 'rbac_test',
    //   synchronize: true,
    //   logging: true,
    //   entities: [User, Role, Permission],
    //   poolSize: 10,
    //   connectorPackage: 'mysql2',
    //   extra: {
    //     authPlugin: 'sha256_password',
    //   },
    // }),
  ],
  controllers: [UserRbacController],
  providers: [
    UserRbacService,
    // 注意这里注入的顺序，先是LoginGuard再是PermissionGuard
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: [UserRbacService],
})
export class UserRbacModule {}
