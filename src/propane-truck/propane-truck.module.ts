import { Module } from '@nestjs/common';
import { PropaneTruckService } from './propane-truck.service';
import { PropaneTruckController } from './propane-truck.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropaneTruck } from './entities/propane-truck.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CommonModule } from 'src/common-services/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropaneTruck, Usuario]),
    CommonModule
  ],
  controllers: [PropaneTruckController],
  providers: [PropaneTruckService],
})
export class PropaneTruckModule {}
