import { Module } from '@nestjs/common';
import { LoginRefreshService } from './login-refresh.service';
import { LoginRefreshController } from './login-refresh.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    /**
     * CREATE DATABASE refresh_token_test DEFAULT CHARACTER SET utf8mb4;
     */
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '123456',
    //   database: 'refresh_token_test',
    //   synchronize: true,
    //   logging: true,
    //   entities: [User],
    //   poolSize: 10,
    //   connectorPackage: 'mysql2',
    //   extra: {
    //     authPlugin: 'sha256_password',
    //   },
    // }),
  ],
  controllers: [LoginRefreshController],
  providers: [LoginRefreshService],
})
export class LoginRefreshModule {}
