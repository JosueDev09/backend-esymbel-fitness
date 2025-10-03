import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS para permitir el frontend
  app.enableCors({
    origin: [
      'http://localhost:8081', // Tu frontend React/React Native
      'http://localhost:3000', // Para desarrollo local
      'http://localhost:8080', // Por si cambias el puerto del frontend
      'http://127.0.0.1:8081', // IP local alternativa
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Bearer',
    ],
    credentials: true, // Para permitir cookies/autenticación
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Servidor ejecutándose en: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(`📱 Frontend permitido desde: http://localhost:8081`);
}
bootstrap();
