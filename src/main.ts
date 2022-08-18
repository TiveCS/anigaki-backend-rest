import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('./secret/key.pem'),
    cert: readFileSync('./secret/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
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

  const port = process.env.NEST_PORT || 5000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
