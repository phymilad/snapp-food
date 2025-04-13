import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const {PORT} = process.env
  await app.listen(process.env.PORT ?? 3000, () => console.log(`http://localhost:${PORT}`));
}
bootstrap();
