import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { City } from 'src/city/entities/city.entity';
import { Zone } from 'src/zone/entities/zone.entity';
import { Factor } from 'src/factor/entities/factor.entity';
import { StationaryTank } from 'src/stationary-tank/entities/stationary-tank.entity';
import { StationaryTankService } from 'src/stationary-tank/stationary-tank.service';
import { CommonModule } from 'src/common-services/common.module';
import { CommonService } from 'src/common-services/common.service';
import { Course } from 'src/courses/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, BranchOffices, Usuario, Client, Notification, City, Zone, Factor, StationaryTank, Course]),
    CommonModule,
  ],
  controllers: [BillController],
  providers: [BillService, NotificationsService, UsuariosService, StationaryTankService, CommonService]
})
export class BillModule { }
