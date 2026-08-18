import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(compression());
  app.use(helmet());

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'POST, DELETE, GET, PATCH',
    credentials: true,
    allowedHeaders:
      'Content-Type, Authorization, X-Requested-With, token, Accept, Api-key',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SCHOOL-PAY API V3')
    .setDescription(
      'API to pay school and document all neccessary record for report purpose ',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter Jwt Token',
      },
      'jwt',
    )

    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter Refresh Token',
      },
      'jwt-refresh',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;

  await app.listen(port, () => {
    Logger.warn(`
       --------------------------------------
      Application Server Successful!
      API Docs: localhost:${port}/api
      --------------------------------------
      `);
  });
}
bootstrap();
