import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { CustomLoggerService } from './common/logger/logger.service';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
import { SanitizeInputInterceptor } from './common/interceptors/sanitize-input.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Usar logger personalizado
  const customLogger = app.get(CustomLoggerService);
  app.useLogger(customLogger);

  // Seguridad: Headers HTTP con Helmet (configuración mejorada)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000, // 1 año
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: 'deny', // Previene clickjacking
      },
      hidePoweredBy: true, // Oculta X-Powered-By header
      noSniff: true, // Previene MIME sniffing
      xssFilter: true, // XSS protection
    }),
  );

  // Request ID Interceptor para trazabilidad
  app.useGlobalInterceptors(new RequestIdInterceptor(customLogger));

  // Sanitización de inputs para prevenir XSS
  app.useGlobalInterceptors(new SanitizeInputInterceptor());

  app.setGlobalPrefix('api');

  // CORS dinámico: '*' en desarrollo, lista específica en producción
  const corsOrigin = envs.nodeEnv === 'development'
    ? '*'
    : envs.allowedOrigins.split(',').map(origin => origin.trim());

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
  });

  customLogger.log(`🔒 CORS configurado para: ${envs.nodeEnv === 'development' ? 'CUALQUIER ORIGEN (desarrollo)' : envs.allowedOrigins}`, 'Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ❌ elimina propiedades que no están en el DTO
      forbidNonWhitelisted: true, // ❌ lanza error si envían algo que no está en el DTO
      transform: true, // ✅ transforma payloads a instancias de DTOs
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Kiosco App API')
    .setDescription('API completa para la gestión de kioscos y tiendas')
    .setVersion('1.0')
    .addTag('Autenticación', 'Endpoints de autenticación y registro')
    .addTag('Tiendas', 'Gestión de tiendas')
    .addTag('Productos', 'Gestión de productos y stock')
    .addTag('Categorías', 'Categorías de productos')
    .addTag('Proveedores', 'Gestión de proveedores')
    .addTag('Categorías de Proveedores', 'Categorías de proveedores')
    .addTag('Compras', 'Gestión de compras a proveedores')
    .addTag('Ingresos', 'Registro de ingresos')
    .addTag('Gastos', 'Registro de gastos')
    .addTag('Empleados', 'Gestión de empleados')
    .addTag('Devoluciones de Venta', 'Devoluciones de clientes')
    .addTag('Devoluciones a Proveedor', 'Devoluciones a proveedores')
    .addTag('Notas de Crédito', 'Notas de crédito de proveedores')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  // await app.listen(process.env.PORT ?? 3003);
  try {
    await app.listen(envs.port);

    customLogger.log(`🚀 Servidor ejecutándose en http://localhost:${envs.port}`, 'Bootstrap');
    customLogger.log(`📚 Documentación Swagger disponible en http://localhost:${envs.port}/api`, 'Bootstrap');
    customLogger.log(`🔒 Ambiente: ${envs.nodeEnv}`, 'Bootstrap');
    customLogger.log(`🛡️ Rate limiting: 10 req/min`, 'Bootstrap');
    customLogger.log(`⏱️ Token expiration: 15 minutos`, 'Bootstrap');
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      customLogger.error(`❌ El puerto ${envs.port} ya está en uso!`, '', 'Bootstrap');
    } else {
      customLogger.error('❌ Error inesperado:', error.stack, 'Bootstrap');
    }
  }
}
bootstrap();
