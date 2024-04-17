import { Module } from '@nestjs/common';
import { PropaneTruckService } from './propane-truck.service';
import { PropaneTruckController } from './propane-truck.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropaneTruck } from './entities/propane-truck.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropaneTruck, Usuario])
  ],
  controllers: [PropaneTruckController],
  providers: [PropaneTruckService],
})
export class PropaneTruckModule {}
