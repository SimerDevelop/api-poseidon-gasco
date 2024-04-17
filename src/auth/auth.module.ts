import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Permissions } from 'src/permissions/entities/permission.entity';
import { InitialPermissionsController } from './auth.InitialPermissionsController';
import { Roles } from 'src/roles/entities/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario, 
      Permissions, 
      Roles
    ]),
  ],
  controllers: [
    InitialPermissionsController
  ],
  providers: [AuthService],
})
export class AuthModule {}
