import { NestFactory } from '@nestjs/core';
import { AppModule } from './board.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
