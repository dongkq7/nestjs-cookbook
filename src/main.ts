import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  app.useStaticAssets('static', { prefix: '/pages' });
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      secret: 'hello world', // 加密cookie的密钥
      resave: false, // session没有变化的时候不要重新生成，如果设置为true，即使 session 数据没有修改，也会在每次请求时重新保存到 session store
      saveUninitialized: false, // 没登录时是否需要创建一个session
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
