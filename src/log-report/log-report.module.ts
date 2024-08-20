import { Module } from '@nestjs/common';
import { LogReportService } from './log-report.service';
import { LogReportController } from './log-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogReport } from './entities/log-report.entity';
import { RouteEvent } from 'src/route-events/entities/route-event.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { PropaneTruckModule } from 'src/propane-truck/propane-truck.module';
import { PropaneTruckService } from 'src/propane-truck/propane-truck.service';
import { PropaneTruck } from 'src/propane-truck/entities/propane-truck.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogReport, RouteEvent, Usuario, PropaneTruck]),
    PropaneTruckModule
  ],
  controllers: [LogReportController],
  providers: [LogReportService, PropaneTruckService],
  exports: [LogReportService]
})
export class LogReportModule {}
