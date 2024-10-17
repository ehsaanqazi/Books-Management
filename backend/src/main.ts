// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';
// import { json, urlencoded } from 'express';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.getHttpAdapter().getInstance().set('trust proxy', 1);

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//     }),
//   );

//   app.enableCors();

//   app.use(json({ limit: '50mb' }));
//   app.use(urlencoded({ limit: '50mb' }));

//   const configService = app.get(ConfigService);

//   await app.listen(configService.get('PORT'));
//   console.log(`Port: ${process.env.PORT}`);
// }

// bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Trust proxy (for deployment scenarios, e.g., Heroku)
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Enable CORS for allowing cross-origin requests
  app.enableCors();

  // Apply global validation pipe with a whitelist (to strip out properties that are not part of DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // Optional: Throw error for extra properties
      transform: true, // Automatically transform payloads to match DTO types
    }),
  );

  // Increase payload limits for handling large requests
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Get the ConfigService to access environment variables
  const configService = app.get(ConfigService);

  // Start the server on the port specified in environment variables
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`Server is running on port: ${port}`);
}

bootstrap();
