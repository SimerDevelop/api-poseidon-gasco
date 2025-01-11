import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AuthService } from './auth/auth.service'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as express from 'express'
import * as bodyParser from 'body-parser';
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurar body-parser para aumentar el límite de tamaño del cuerpo de la solicitud
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Ruta para servir archivos estáticos desde la carpeta 'temp'
  app.use('/temp', express.static(join(__dirname, '..', 'temp')));

  const authService = app.get(AuthService);
  await authService.createInitialPermissions();
  await authService.createInitialRoles();
  await authService.createInitialUser();
  await authService.createRouteEvents();

  // Configurar CORS para permitir solicitudes desde localhost:4200
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(4006);
}

bootstrap();
