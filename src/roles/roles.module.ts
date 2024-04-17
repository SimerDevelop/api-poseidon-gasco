import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Roles } from './entities/roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from 'src/permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roles, Permissions]), // Importar si se utiliza TypeORM
  ],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}
