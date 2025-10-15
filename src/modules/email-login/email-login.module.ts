import { Module } from '@nestjs/common';
import { EmailLoginService } from './email-login.service';
import { EmailLoginController } from './email-login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    // /**
    //  * CREATE DATABASE email_login DEFAULT CHARACTER SET utf8mb4;
    //  */
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '123456',
    //   database: 'email_login',
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
  controllers: [EmailLoginController],
  providers: [EmailLoginService],
})
export class EmailLoginModule {}
