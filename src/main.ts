import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync('../secret/key.pem'),
      cert: fs.readFileSync('../secret/cert.pem'),
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const origin: string | RegExp = process.env.FRONTEND_URL || '*';
  app.enableCors({
    origin: origin,
    credentials: true,
  });

  await app.listen(5000, '0.0.0.0');
}
bootstrap();
