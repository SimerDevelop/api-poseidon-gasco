import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Permissions } from 'src/permissions/entities/permission.entity';
import { InitialPermissionsController } from './auth.InitialPermissionsController';
import { Roles } from 'src/roles/entities/roles.entity';
import { RouteEvent } from 'src/route-events/entities/route-event.entity';
import { RouteEventsModule } from 'src/route-events/route-events.module';
import { RouteEventsService } from 'src/route-events/route-events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario, 
      Permissions, 
      Roles,
      RouteEvent
    ]),
    RouteEventsModule
  ],
  controllers: [
    InitialPermissionsController
  ],
  providers: [AuthService, RouteEventsService],
})
export class AuthModule {}
