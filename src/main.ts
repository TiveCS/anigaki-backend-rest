import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  const origin: string | RegExp = process.env.FRONTEND_URL || '*';
  app.enableCors({
    origin: origin,
    credentials: true,
  });

  await app.listen(5000, '0.0.0.0');
}
bootstrap();
