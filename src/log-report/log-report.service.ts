import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { LogReport } from './entities/log-report.entity';
import { RouteEvent } from 'src/route-events/entities/route-event.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { PropaneTruckService } from 'src/propane-truck/propane-truck.service';
import * as moment from 'moment';
import { Between } from 'typeorm'; // Asegúrate de importar Between

@Injectable()
export class LogReportService {
  constructor(
    @InjectRepository(LogReport) private logReportRepository: Repository<LogReport>,
    @InjectRepository(RouteEvent) private routeEventRepository: Repository<RouteEvent>,
    @InjectRepository(Usuario) private usuariosRepository: Repository<Usuario>,
    private propaneTruckService: PropaneTruckService
  ) { }

  async create(logReportData: LogReport): Promise<any> {    
    try {      
      if (logReportData) {
        const route_event = await this.routeEventRepository.findOne({
          where: { code_event: logReportData.code_event },
        });
        
        const user = await this.usuariosRepository.findOne({
          where: { id: logReportData.userId },
          relations: ['role'],
        });
  
        console.log(logReportData.userId);
        
        let propaneTruck = {
          data: [
            { plate: "none" }
          ]
        };
  
        if (user.role.name === 'Operario') {
          propaneTruck = await this.propaneTruckService.getByOperatorId(parseInt(user.idNumber));
        }
  
        // Contar el número de registros existentes
        const totalLogReports = await this.logReportRepository.count();
  
        // Si hay 1000 o más registros, eliminar el más antiguo
        if (totalLogReports >= 1000) {
          const oldestLogReport = await this.logReportRepository.find({
            order: { create: 'ASC' },
            take: 1,
          });
  
          if (oldestLogReport.length > 0) {
            await this.logReportRepository.remove(oldestLogReport[0]);
          }
        }
  
        const newLogReport = this.logReportRepository.create({
          ...logReportData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
          route_event: route_event,
          user: user,
          propane_truck: propaneTruck.data[0]
        });
  
        const createdLogReport = await this.logReportRepository.save(newLogReport);
  
        if (createdLogReport) {
          return ResponseUtil.success(
            200,
            'Informe de registro creado exitosamente',
            createdLogReport
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el Informe de registro'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el Informe de registro',
        error.message
      );
    }
  }
  async findAll(): Promise<any> {
    try {
      const logReports = await this.logReportRepository.find({
        where: { state: 'ACTIVO' },
        relations: ['route_event', 'user'],
      });

      if (logReports.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Informes de registro'
        );
      }

      return ResponseUtil.success(
        200,
        'Informes de registro encontrados',
        logReports
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Informes de registro'
      );
    }
  }

  async findOne(id: string) {
    try {
      const logReport = await this.logReportRepository.findOneBy({
        id: id
      });

      if (logReport) {
        return ResponseUtil.success(
          200,
          'Informe de registro encontrado',
          logReport
        );
      } else {
        return ResponseUtil.error(
          404,
          'Informe de registro no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el Informe de registro'
      );
    }
  }

  async update(id, logReportData) {
    try {
      const existingLogReport = await this.logReportRepository.findOne({
        where: { id },
      });

      if (!existingLogReport) {
        throw new NotFoundException('Informe de registro no encontrado');
      }

      const updatedLogReport = await this.logReportRepository.save({
        ...existingLogReport,
        ...logReportData,
      });

      return ResponseUtil.success(
        200,
        'Informe de registro actualizado exitosamente',
        updatedLogReport
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Informe de registro no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Informe de registro'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingLogReport = await this.logReportRepository.findOne({
        where: { id },
      });

      if (!existingLogReport) {
        return ResponseUtil.error(404, 'Informe de registro no encontrado');
      }

      existingLogReport.state = 'INACTIVO';
      const updatedZone = await this.logReportRepository.save(existingLogReport);

      if (updatedZone) {
        return ResponseUtil.success(
          200,
          'Informe de registro eliminado exitosamente',
          updatedZone
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Informe de registro'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Informe de registro'
      );
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async findByDay(): Promise<any> {
    try {
      const today = moment().startOf('day').toDate();
      const tomorrow = moment(today).add(1, 'days').toDate();
  
      const logReports = await this.logReportRepository.find({
        where: {
          state: 'ACTIVO',
          create: Between(today, tomorrow)
        },
        relations: ['route_event', 'user'],
      });
  
      if (logReports.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Informes de registro'
        );
      }
  
      return ResponseUtil.success(
        200,
        'Informes de registro encontrados',
        logReports
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Informes de registro'
      );
    }
  }
}
