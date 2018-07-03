import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: null, validationError: {target: false}}));
  const options = new DocumentBuilder()
    .setTitle('Ivan\'s Blog')
    .setDescription('Ivan\'s Blog API description')
    .setVersion('1.0')
    .addTag('users')
    .addTag('articles')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3100);
}

bootstrap();
