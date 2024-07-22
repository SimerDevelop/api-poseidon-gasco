import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { Request } from './entities/request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { PropaneTruck } from 'src/propane-truck/entities/propane-truck.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, Order, PropaneTruck, Usuario, BranchOffices])
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService]
})
export class RequestModule {}
