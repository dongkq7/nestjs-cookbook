import { Module } from '@nestjs/common';
import { UserLoginService } from './user-login.service';
import { UserLoginController } from './user-login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    /**
     * 提前创建好数据库：
     * CREATE SCHEMA login_test DEFAULT CHARACTER SET utf8mb4;
     */
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '8630976qq',
    //   database: 'login_test',
    //   synchronize: true,
    //   logging: true,
    //   entities: [User],
    //   poolSize: 10,
    //   connectorPackage: 'mysql2',
    //   extra: {
    //     authPlugins: 'sha256_password',
    //   },
    // }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserLoginController],
  providers: [UserLoginService],
})
export class UserLoginModule {}
