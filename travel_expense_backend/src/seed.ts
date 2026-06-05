import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './modules/database/seed.service';

async function bootstrap() {
  console.log('Starting standalone database seed context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(SeedService);
  
  try {
    await seeder.seed();
  } catch (error) {
    console.error('Seeding process encountered an error:', error);
  } finally {
    await app.close();
    console.log('Seeder process closed.');
  }
}
bootstrap();
