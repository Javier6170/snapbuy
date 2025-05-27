import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';


async function bootstrap() {
  // 1. Crear la aplicación Nest
  const app = await NestFactory.create(AppModule);

  // 2. Configurar CORS para el frontend React
  app.enableCors({
    origin: ['*'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );

  // 4. Filtros e interceptores globales
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // 5. Prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api');

  // 6. Configuración de Swagger
const swaggerConfig = new DocumentBuilder()
  .setTitle('SnapBuy API')
  .setDescription('API de SnapBuy para gestión de productos, pagos y entregas')
  .setVersion('1.0')
  // Servidores
  .addServer('http://localhost:4000/api', 'Local (dev)')
  .addServer('en proceso...', 'Producción')
  // Contacto
  .setContact(
    'Javier Rodriguez Marulanda',
    'https://github.com/Javier6170/snapbuy',
    'javierrodriguezmarulanda@gmail.com',
  )
  // Tags con descripción
  .addTag('products',     'Gestión de productos (CRUD, stock, imágenes)')
  .addTag('transactions', 'Crear/actualizar transacciones')
  .addTag('payments',     'Endpoints de pago (tokenización, transacciones)')
  .addTag('deliveries',   'Registro y actualización de entregas')
  .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // 7. Montar Swagger UI en /api/docs
  SwaggerModule.setup('docs', app, document);

  // 8. Levantar el servidor
  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`> Server escuchando en http://localhost:${port}`);
  console.log(`> Swagger UI disponible en http://localhost:${port}/docs`);
}

bootstrap();
