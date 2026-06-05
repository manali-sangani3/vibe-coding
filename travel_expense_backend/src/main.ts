import { otelSDK } from './tracing';
// Start OpenTelemetry SDK before initializing NestJS app if not in offline mode
if (process.env.OFFLINE_MODE !== 'true') {
  otelSDK.start();
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors();

  // Serve static files from the "uploads" directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Enable global validations for input payloads
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enforce API version prefix 'v1' globally
  app.setGlobalPrefix('v1');

  // Configure Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Enterprise Travel & Expense Management API')
    .setDescription('Production-grade NestJS REST API endpoints for authentication, dynamic approvals, travel management, and compliance rules.')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\x1b[32m[NestJS] Server successfully booted on port ${port}\x1b[0m`);
  console.log(`\x1b[36m[Swagger] Interface available at: http://localhost:${port}/api-docs\x1b[0m`);
}
bootstrap();
