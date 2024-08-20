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
import { PropaneTruck } from 'src/propane-truck/entities/propane-truck.entity';
import { Order } from 'src/orders/entities/order.entity';
import { RequestModule } from 'src/request/request.module';
import { RequestService } from 'src/request/request.service';
import { Request } from 'src/request/entities/request.entity';
import { LogReportModule } from 'src/log-report/log-report.module';
import { LogReportService } from 'src/log-report/log-report.service';
import { LogReport } from 'src/log-report/entities/log-report.entity';
import { RouteEventsModule } from 'src/route-events/route-events.module';
import { RouteEvent } from 'src/route-events/entities/route-event.entity';
import { PropaneTruckModule } from 'src/propane-truck/propane-truck.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Bill,
      BranchOffices,
      Usuario, Client,
      Notification,
      City,
      Zone,
      Factor,
      StationaryTank,
      Course,
      PropaneTruck,
      Order,
      Request,
      LogReport,
      RouteEvent
    ]),
    CommonModule,
    RequestModule,
    LogReportModule,
    RouteEventsModule,
    PropaneTruckModule
  ],
  controllers: [BillController],
  providers: [BillService, NotificationsService, UsuariosService, StationaryTankService, CommonService, RequestService, LogReportService]
})
export class BillModule { }
