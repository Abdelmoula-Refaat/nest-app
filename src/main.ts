import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseStructure } from './common/interceptor/response.interceptor';

const port = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseStructure());
  app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}));
  await app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
}
bootstrap();
