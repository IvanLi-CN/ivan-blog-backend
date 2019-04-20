import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger: true});
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(9102);
}
bootstrap();
