import { Module } from '@nestjs/common';
import { BranchOfficesService } from './branch-offices.service';
import { BranchOfficesController } from './branch-offices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchOffices } from './entities/branch-office.entity';
import { City } from 'src/city/entities/city.entity';
import { Zone } from 'src/zone/entities/zone.entity';
import { Factor } from 'src/factor/entities/factor.entity';
import { Client } from 'src/clients/entities/client.entity';
import { BillService } from 'src/bill/bill.service';
import { Bill } from 'src/bill/entities/bill.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { StationaryTank } from 'src/stationary-tank/entities/stationary-tank.entity';
import { StationaryTankService } from 'src/stationary-tank/stationary-tank.service';
import { BillModule } from 'src/bill/bill.module';
import { CommonModule } from 'src/common-services/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BranchOffices,
      City,
      Zone,
      Factor,
      Client,
      Bill,
      Usuario,
      Notification,
      StationaryTank
    ]),
    NotificationsModule,
    UsuariosModule,
    BillModule,
    CommonModule
  ],
  controllers: [BranchOfficesController],
  providers: [
    BranchOfficesService, BillService, NotificationsService, StationaryTankService
  ],
  exports: [BranchOfficesService]
})
export class BranchOfficesModule { }
