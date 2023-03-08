import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionFilter } from '@nestjs/common';
import { HttpExceptionFilter } from './util/http-exception.filter';
import { SwaggerInit } from './API/SwaggerConfig';
import { PrismaService } from './prisma.services';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.setGlobalPrefix('/');
  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: '*',
    });
  }
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  SwaggerInit.init(app);
  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger Docomentation On: ${await app.getUrl()}/api/v1/docs`);
}
bootstrap();
